import { Lang, parse } from '@ast-grep/napi';
const classRule = { any: [{ kind: 'class_declaration' }, { kind: 'class' }] };
const functionScopes = new Set([
  'function_expression', 'function_declaration', 'generator_function',
  'generator_function_declaration', 'method_definition', 'class', 'class_declaration',
]);
const setSuperHelper = `function __openmzSetSuper(base, key, value, receiver) {
    if (!Reflect.set(base, key, value, receiver)) {
        throw new TypeError("Cannot assign super property " + key);
    }
    return value;
}`;

function hasToken(node, token) {
  return node.children().some(child => child.kind() === token);
}

function unsupported(node, message, filename) {
  const { line, column } = node.range().start;
  throw new Error(`${filename}:${line + 1}:${column + 1}: ${message}`);
}

function superProperty(node) {
  return node.kind() === 'member_expression' && node.field('object')?.kind() === 'super';
}

function rewriteBody(body, context) {
  const { name, isStatic, isConstructor, filename } = context;
  const receiver = 'this';
  const base = `Object.getPrototypeOf(${name}${isStatic ? '' : '.prototype'})`;

  function readSuper(node) {
    return `Reflect.get(${base}, ${JSON.stringify(node.field('property').text())}, ${receiver})`;
  }

  function visit(node) {
    if (functionScopes.has(node.kind())) {
      return node.text();
    }
    if (node.kind() === 'call_expression') {
      const callee = node.field('function');
      if (callee.kind() === 'super') {
        if (!isConstructor || node.parent().kind() !== 'expression_statement'
          || node.parent().parent().range().start.index !== body.range().start.index) {
          unsupported(node, 'Expected a standalone super() in the constructor body', filename);
        }
        const args = visit(node.field('arguments')).slice(1, -1);
        return `Object.getPrototypeOf(${name}).call(this${args.trim() ? `, ${args}` : ''})`;
      }
      if (superProperty(callee)) {
        const args = visit(node.field('arguments')).slice(1, -1);
        return `${readSuper(callee)}.call(${receiver}${args.trim() ? `, ${args}` : ''})`;
      }
    }
    if (node.kind() === 'assignment_expression' && superProperty(node.field('left'))) {
      const property = node.field('left').field('property').text();
      context.needsSetSuper = true;
      return `__openmzSetSuper(${base}, ${JSON.stringify(property)}, ${visit(node.field('right'))}, ${receiver})`;
    }
    if (superProperty(node)) {
      return readSuper(node);
    }
    if (node.kind() === 'super') {
      unsupported(node, 'Unsupported super expression', filename);
    }
    const edits = [];
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

function convertClass(node, filename) {
  const binding = node.parent();
  const inferredName = binding.kind() === 'variable_declarator' ? binding.field('name')
    : binding.kind() === 'assignment_expression' ? binding.field('left') : null;
  const name = node.field('name')?.text()
    ?? (inferredName?.kind() === 'identifier' ? inferredName.text() : null);
  if (!name) unsupported(node, 'Expected a class name or an identifier assignment', filename);
  const heritage = node.children().find(child => child.kind() === 'class_heritage');
  const parent = heritage?.children().find(child => child.isNamed())?.text();
  const members = node.field('body').children().filter(child => child.isNamed());
  const methods = [];
  const fields = [];
  let constructor;
  let comments = [];
  let needsSetSuper = false;

  for (const member of members) {
    if (member.kind() === 'comment') {
      comments.push(member.text());
      continue;
    }
    const prefix = comments.length ? `${comments.join('\n')}\n` : '';
    comments = [];
    if (member.kind() === 'field_definition') {
      if (!hasToken(member, 'static') || member.field('property').kind() !== 'property_identifier') {
        unsupported(member, 'Only named static fields are used by the engine', filename);
      }
      const property = JSON.stringify(member.field('property').text());
      const value = member.field('value')?.text() ?? 'undefined';
      fields.push(`${prefix}Object.defineProperty(${name}, ${property}, { value: ${value}, writable: true, enumerable: true, configurable: true });`);
      continue;
    }
    if (member.kind() !== 'method_definition' || member.field('name').kind() !== 'property_identifier') {
      unsupported(member, 'Unsupported class member', filename);
    }
    const methodName = member.field('name').text();
    const isStatic = hasToken(member, 'static');
    const isConstructor = methodName === 'constructor' && !isStatic;
    const context = { name, isStatic, isConstructor: isConstructor && !!parent, filename };
    const body = parent ? rewriteBody(member.field('body'), context) : member.field('body').text();
    needsSetSuper ||= context.needsSetSuper;
    const parameters = member.field('parameters').text();
    if (isConstructor) {
      constructor = `${prefix}function ${name}${parameters} ${body}`;
      continue;
    }
    const target = `${name}${isStatic ? '' : '.prototype'}`;
    const async = hasToken(member, 'async') ? 'async ' : '';
    const generator = hasToken(member, '*') ? '*' : '';
    const fn = `${async}function${generator}${parameters} ${body}`;
    const accessor = hasToken(member, 'get') ? 'get' : hasToken(member, 'set') ? 'set' : null;
    if (accessor) {
      methods.push(`${prefix}Object.defineProperty(${target}, ${JSON.stringify(methodName)}, {\n    ${accessor}: ${fn},\n    configurable: true\n});`);
    } else {
      methods.push(`${prefix}${target}.${methodName} = ${fn};`);
    }
  }
  if (!constructor) {
    const body = parent ? `return Object.getPrototypeOf(${name}).apply(this, arguments);` : '';
    constructor = `function ${name}() { ${body} }`;
  }
  const output = [constructor];
  if (parent) {
    output.push(`${name}.prototype = Object.create(${parent}.prototype, {\n    constructor: { value: ${name}, writable: true, configurable: true }\n});\nObject.setPrototypeOf(${name}, ${parent});`);
  }
  output.push(...methods, ...fields, ...comments);
  // Keep class strictness local: the engine also creates globals in sloppy script code.
  const expression = `(function() {\n"use strict";\n\n${output.join('\n\n')}\n\nreturn ${name};\n})()`;
  const text = node.kind() === 'class' ? expression : `var ${name} = ${expression};`;
  return { text, needsSetSuper };
}

export function transformClasses(source, filename = '<source>') {
  const root = parse(Lang.JavaScript, source).root();
  const classes = root.findAll({ rule: classRule });
  let needsSetSuper = false;
  const edits = classes.map(node => {
    if (node.ancestors().some(ancestor => ancestor.kind() === 'class' || ancestor.kind() === 'class_declaration')) {
      unsupported(node, 'Nested classes are not used by the engine', filename);
    }
    const result = convertClass(node, filename);
    needsSetSuper ||= result.needsSetSuper;
    return node.replace(result.text);
  });
  const header = needsSetSuper ? `${setSuperHelper}\n\n` : '';
  return header + root.commitEdits(edits);
}

export function restorePixiInitializers(source) {
  const root = parse(Lang.JavaScript, source).root();
  const edits = [];
  for (const node of root.findAll({ rule: classRule })) {
    const parent = node.children().find(child => child.kind() === 'class_heritage')
      ?.children().find(child => child.isNamed())?.text();
    if (!parent?.startsWith('PIXI.')) continue;
    const methods = node.field('body').children().filter(child => child.kind() === 'method_definition');
    const constructor = methods.find(method => method.field('name').text() === 'constructor');
    const initialize = methods.find(method => method.field('name').text() === 'initialize');
    if (!constructor || !initialize) continue;
    const body = constructor.field('body');
    const statements = body.children().filter(child => child.isNamed() && child.kind() !== 'comment');
    const hook = statements.at(-1);
    if (!hook?.matches('this.initialize($$$ARGS);')) {
      unsupported(constructor, 'Expected the Pixi constructor to end with this.initialize()', 'rmmz_core.js');
    }
    const superEdits = body.findAll({ rule: { pattern: 'super($$$ARGS)' } }).map(call => {
      const args = call.field('arguments').text().slice(1, -1);
      return call.replace(`${parent}.call(this${args.trim() ? `, ${args}` : ''})`);
    });
    // Move parent construction into the hook so legacy plugin objects are initialized in place.
    const prefix = body.commitEdits([...superEdits, hook.replace('')]).slice(1, -1);
    const initializeBody = initialize.field('body');
    edits.push(body.replace(`{\n        ${hook.text()}\n    }`));
    edits.push(initializeBody.replace(`{${prefix}${initializeBody.text().slice(1)}`));
  }
  return root.commitEdits(edits);
}
