import type { Edit, SgNode } from '@ast-grep/napi';
interface ClassContext {
  name: string;
  isStatic: boolean;
  isConstructor: boolean;
  filename: string;
  needsSetSuper?: boolean;
}
interface ClassOptions {
  name: string;
  constructorName?: string;
  displayName?: string;
  expression?: boolean;
}
import { Lang, parse } from '@ast-grep/napi';
const classRule = { any: [{ kind: 'class_declaration' }, { kind: 'class' }] };
const functionScopes = new Set<string | number>([
  'function_expression',
  'function_declaration',
  'generator_function',
  'generator_function_declaration',
  'method_definition',
  'class',
  'class_declaration',
]);
const setSuperHelper = `function __openmzSetSuper(base, key, value, receiver) {
    if (!Reflect.set(base, key, value, receiver)) {
        throw new TypeError("Cannot assign super property " + key);
    }
    return value;
}`;

function hasToken(node: SgNode, token: string) {
  return node.children().some((child) => child.kind() === token);
}

function unsupported(node: SgNode, message: string, filename: string): never {
  const { line, column } = node.range().start;
  throw new Error(`${filename}:${line + 1}:${column + 1}: ${message}`);
}

function superProperty(node: SgNode) {
  return node.kind() === 'member_expression' && node.field('object')?.kind() === 'super';
}

function rewriteBody(body: SgNode, context: ClassContext) {
  const { name, isStatic, isConstructor, filename } = context;
  const receiver = 'this';
  const base = `Object.getPrototypeOf(${name}${isStatic ? '' : '.prototype'})`;

  function readSuper(node: SgNode) {
    return `Reflect.get(${base}, ${JSON.stringify(node.field('property')!.text())}, ${receiver})`;
  }

  function visit(node: SgNode): string {
    if (functionScopes.has(node.kind())) {
      return node.text();
    }
    if (node.kind() === 'call_expression') {
      const callee = node.field('function')!;
      if (callee.kind() === 'super') {
        if (
          !isConstructor ||
          node.parent()!.kind() !== 'expression_statement' ||
          node.parent()!.parent()!.range().start.index !== body.range().start.index
        ) {
          unsupported(node, 'Expected a standalone super() in the constructor body', filename);
        }
        const args = visit(node.field('arguments')!).slice(1, -1);
        return `Object.getPrototypeOf(${name}).call(this${args.trim() ? `, ${args}` : ''})`;
      }
      if (superProperty(callee)) {
        const args = visit(node.field('arguments')!).slice(1, -1);
        return `${readSuper(callee)}.call(${receiver}${args.trim() ? `, ${args}` : ''})`;
      }
    }
    if (node.kind() === 'assignment_expression' && superProperty(node.field('left')!)) {
      const property = node.field('left')!.field('property')!.text();
      context.needsSetSuper = true;
      return `__openmzSetSuper(${base}, ${JSON.stringify(property)}, ${visit(node.field('right')!)}, ${receiver})`;
    }
    if (superProperty(node)) {
      return readSuper(node);
    }
    if (node.kind() === 'super') {
      unsupported(node, 'Unsupported super expression', filename);
    }
    const edits: Edit[] = [];
    for (const child of node.children()) {
      if (!child.isNamed()) continue;
      const replacement = visit(child);
      if (replacement !== child.text()) edits.push(child.replace(replacement));
    }
    return edits.length ? node.commitEdits(edits) : node.text();
  }

  if (!isConstructor && !body.find({ rule: { kind: 'super' } })) return body.text();
  return visit(body);
}

function renameClassReferences(node: SgNode, name: string, replacement: string) {
  const edits: Edit[] = node
    .field('body')!
    .findAll({
      rule: {
        any: [
          { kind: 'identifier' },
          { kind: 'shorthand_property_identifier' },
          { kind: 'shorthand_property_identifier_pattern' },
        ],
      },
    })
    .filter((reference) => reference.text() === name)
    .map((reference) => reference.replace(reference.kind() === 'identifier' ? replacement : `${name}: ${replacement}`));
  if (!edits.length) return node;
  return parse(Lang.JavaScript, `(${node.commitEdits(edits)})`)
    .root()
    .find({ rule: { kind: 'class' } })!;
}

function convertClass(
  node: SgNode,
  filename: string,
  { name, constructorName = name, displayName = constructorName, expression = false }: ClassOptions,
) {
  const constructorHead = expression
    ? `const ${name} = function${constructorName ? ` ${constructorName}` : ''}`
    : `function ${name}`;
  const heritage = node.children().find((child) => child.kind() === 'class_heritage');
  const parent = heritage
    ?.children()
    .find((child) => child.isNamed())
    ?.text();
  const members = node
    .field('body')!
    .children()
    .filter((child) => child.isNamed());
  const methods: string[] = [];
  const fields: string[] = [];
  let constructor;
  let comments: string[] = [];
  let needsSetSuper = false;

  for (const member of members) {
    if (member.kind() === 'comment') {
      comments.push(member.text());
      continue;
    }
    const prefix = comments.length ? `${comments.join('\n')}\n` : '';
    comments = [];
    if (member.kind() === 'field_definition') {
      if (!hasToken(member, 'static') || member.field('property')!.kind() !== 'property_identifier') {
        unsupported(member, 'Only named static fields are used by the engine', filename);
      }
      const property = JSON.stringify(member.field('property')!.text());
      const value = member.field('value')?.text() ?? 'undefined';
      fields.push(
        `${prefix}Object.defineProperty(${name}, ${property}, { value: ${value}, writable: true, enumerable: true, configurable: true });`,
      );
      continue;
    }
    if (member.kind() !== 'method_definition' || member.field('name')!.kind() !== 'property_identifier') {
      unsupported(member, 'Unsupported class member', filename);
    }
    const methodName = member.field('name')!.text();
    const isStatic = hasToken(member, 'static');
    const isConstructor = methodName === 'constructor' && !isStatic;
    const context = {
      name,
      isStatic,
      isConstructor: isConstructor && !!parent,
      filename,
      needsSetSuper: false,
    };
    const body = parent ? rewriteBody(member.field('body')!, context) : member.field('body')!.text();
    needsSetSuper ||= context.needsSetSuper;
    const parameters = member.field('parameters')!.text();
    if (isConstructor) {
      constructor = `${prefix}${constructorHead}${parameters} ${body}${expression ? ';' : ''}`;
      continue;
    }
    const target = `${name}${isStatic ? '' : '.prototype'}`;
    const async = hasToken(member, 'async') ? 'async ' : '';
    const generator = hasToken(member, '*') ? '*' : '';
    const fn = `${async}function${generator}${parameters} ${body}`;
    const accessor = hasToken(member, 'get') ? 'get' : hasToken(member, 'set') ? 'set' : null;
    if (accessor) {
      methods.push(
        `${prefix}Object.defineProperty(${target}, ${JSON.stringify(methodName)}, {\n    ${accessor}: ${fn},\n    configurable: true\n});`,
      );
    } else {
      methods.push(`${prefix}${target}.${methodName} = ${fn};`);
    }
  }
  if (!constructor) {
    const body = parent ? `return Object.getPrototypeOf(${name}).apply(this, arguments);` : '';
    constructor = `${constructorHead}() { ${body} }${expression ? ';' : ''}`;
  }
  const output = [constructor];
  if (expression && !constructorName) {
    output.push(
      `Object.defineProperty(${name}, "name", { value: ${JSON.stringify(displayName)}, configurable: true });`,
    );
  }
  if (parent) {
    output.push(
      `${name}.prototype = Object.create(${parent}.prototype, {\n    constructor: { value: ${name}, writable: true, configurable: true }\n});\nObject.setPrototypeOf(${name}, ${parent});`,
    );
  }
  output.push(...methods, ...fields, ...comments);
  return { text: output.join('\n\n'), needsSetSuper };
}

export function transformClasses(source: string, filename: string = '<source>') {
  const root = parse(Lang.JavaScript, source).root();
  const classes = root.findAll({ rule: classRule });
  const identifiers = new Set(root.findAll({ rule: { kind: 'identifier' } }).map((node) => node.text()));
  const stem = filename
    .split(/[\\/]/)
    .pop()!
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w$]/g, '_');
  let sequence = 0;
  let needsSetSuper = false;
  const edits: Edit[] = classes.map((node) => {
    if (node.ancestors().some((ancestor) => ancestor.kind() === 'class' || ancestor.kind() === 'class_declaration')) {
      unsupported(node, 'Nested classes are not used by the engine', filename);
    }
    if (node.kind() === 'class_declaration') {
      const result = convertClass(node, filename, {
        name: node.field('name')!.text(),
      });
      needsSetSuper ||= result.needsSetSuper;
      return node.replace(result.text);
    }
    const binding = node.parent()!;
    const statement = binding.parent()!;
    const variable = binding.kind() === 'variable_declarator';
    if (
      !(variable && ['variable_declaration', 'lexical_declaration'].includes(String(statement.kind()))) &&
      !(binding.kind() === 'assignment_expression' && String(statement.kind()) === 'expression_statement')
    ) {
      unsupported(node, 'Expected a standalone class assignment or variable declaration', filename);
    }
    if (variable && statement.children().filter((child) => child.kind() === 'variable_declarator').length !== 1) {
      unsupported(node, 'Expected one class variable per declaration', filename);
    }
    const originalName = node.field('name')?.text();
    const target = binding.field(variable ? 'name' : 'left')!;
    const displayName = originalName ?? (target.kind() === 'identifier' ? target.text() : null);
    if (!displayName) unsupported(node, 'Expected a class name or an identifier assignment', filename);
    let name;
    do {
      name = `_openmz_${stem}_${++sequence}`;
    } while (identifiers.has(name));
    identifiers.add(name);
    const renamed = originalName ? renameClassReferences(node, originalName, name) : node;
    const result = convertClass(renamed, filename, {
      name,
      constructorName: originalName ?? '',
      displayName,
      expression: true,
    });
    needsSetSuper ||= result.needsSetSuper;
    const assignment = statement.commitEdits([node.replace(name)]);
    return statement.replace(`${result.text}\n\n${assignment}`);
  });
  let header = '';
  if (needsSetSuper) {
    const first = root.children()[0];
    if (first?.kind() === 'comment') {
      edits.push(first.replace(`${first.text()}\n\n${setSuperHelper}`));
    } else {
      header = `${setSuperHelper}\n\n`;
    }
  }
  return header + root.commitEdits(edits);
}

export function restorePixiInitializers(source: string, filename: string = '<source>') {
  const root = parse(Lang.JavaScript, source).root();
  const edits: Edit[] = [];
  for (const node of root.findAll({ rule: classRule })) {
    const parent = node
      .children()
      .find((child) => child.kind() === 'class_heritage')
      ?.children()
      .find((child) => child.isNamed())
      ?.text();
    if (!parent?.startsWith('PIXI.')) continue;
    const methods = node
      .field('body')!
      .children()
      .filter((child) => child.kind() === 'method_definition');
    const constructor = methods.find((method) => method.field('name')!.text() === 'constructor');
    const initialize = methods.find((method) => method.field('name')!.text() === 'initialize');
    if (!constructor || !initialize) continue;
    const body = constructor.field('body')!;
    const statements = body.children().filter((child) => child.isNamed() && child.kind() !== 'comment');
    const hook = statements.at(-1);
    const call = hook?.children().find((child) => child.kind() === 'call_expression');
    let callee = call?.field('function');
    while (callee?.kind() === 'parenthesized_expression') callee = callee.children().find((child) => child.isNamed());
    if (!callee?.matches('this.initialize')) {
      unsupported(constructor, 'Expected the Pixi constructor to end with this.initialize()', filename);
    }
    const superEdits = body.findAll({ rule: { pattern: 'super($$$ARGS)' } }).map((call) => {
      const args = call.field('arguments')!.text().slice(1, -1);
      return call.replace(`${parent}.call(this${args.trim() ? `, ${args}` : ''})`);
    });
    // Move parent construction into the hook so legacy plugin objects are initialized in place.
    const prefix = body.commitEdits([...superEdits, hook!.replace('')]).slice(1, -1);
    const ctorParams = constructor.field('parameters')!;
    const initParams = initialize.field('parameters')!;
    const namedCtorParams = ctorParams.children().filter((child) => child.isNamed());
    const namedInitParams = initParams.children().filter((child) => child.isNamed());
    const isRestOnly = namedCtorParams.length === 1 && namedCtorParams[0].kind() === 'rest_pattern';
    if (!isRestOnly) {
      if (namedCtorParams.length > 0) {
        if (namedInitParams.length === 0) {
          edits.push(initParams.replace(ctorParams.text()));
        } else {
          const ctorNames = namedCtorParams.map((param) => param.text().trim());
          const initNames = namedInitParams.map((param) => param.text().trim());
          if (ctorNames.length !== initNames.length || ctorNames.some((name, index) => name !== initNames[index])) {
            unsupported(
              initialize,
              'Expected initialize() parameters to be empty or match the Pixi constructor parameters',
              filename,
            );
          }
        }
      }
      edits.push(ctorParams.replace('(...args)'));
      edits.push(body.replace('{\n        this.initialize(...args);\n    }'));
    } else {
      edits.push(body.replace(`{\n        ${hook!.text()}\n    }`));
    }
    const initializeBody = initialize.field('body')!;
    edits.push(initializeBody.replace(`{${prefix}${initializeBody.text().slice(1)}`));
  }
  return root.commitEdits(edits);
}
