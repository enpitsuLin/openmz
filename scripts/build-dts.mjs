import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const check = process.argv.includes('--check')
const project = fileURLToPath(new URL('../tsconfig.json', import.meta.url))
const projectDir = dirname(project)
const runtimeSourceDir = resolve(projectDir, 'src/js')
const typesOutputDir = resolve(projectDir, 'types')
const runtimeFilePattern = /^(?:rmmz_.*|main)\.js$/

// Give class expressions stable names during inference so Pixi internals are
// inherited by name instead of being expanded into the anonymous class type.
const nestedClasses = new Map([
  ['Graphics.FPSCounter', 'GraphicsFPSCounter'],
  ['Tilemap.Layer', 'TilemapLayer'],
  ['Tilemap.CombinedLayer', 'TilemapCombinedLayer'],
])
const qualifiedClasses = new Map(
  [...nestedClasses].map(([qualified, internal]) => [internal, qualified]),
)
qualifiedClasses.set('RmmzWindow', 'RMMZ.Window')
qualifiedClasses.set('RmmzStorageManager', 'RMMZ.StorageManager')

const polymorphicZeroArgInitialize = new Set([
  'Game_BattlerBase',
  'Game_Battler',
  'Game_CharacterBase',
  'Game_Character',
  'Sprite_Clickable',
  'Window',
])
const polymorphicOverloadMethods = new Map([
  ['Sprite_Character', new Set(['initialize'])],
  ['Sprite_Actor', new Set(['initialize'])],
  ['Sprite_Battleback', new Set(['initialize'])],
  ['Window_EquipStatus', new Set(['drawItem'])],
])
const nestedClassPattern = new RegExp(
  `\\b(?:${[...nestedClasses.keys()].map(key => key.replace('.', '\\.')).join('|')})\\b`,
  'g',
)

function applyEdits(text, edits) {
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) {
    text = text.slice(0, start) + replacement + text.slice(end)
  }
  return text
}

function prepareSource(source) {
  const edits = []
  const commentRegex = /\/\*\*[\s\S]*?\*\//g
  for (const match of source.text.matchAll(commentRegex)) {
    const start = match.index
    const end = start + match[0].length
    const replaced = match[0].replace(nestedClassPattern, key => nestedClasses.get(key))
    if (replaced !== match[0]) {
      edits.push([start, end, replaced])
    }
  }
  function visit(node) {
    if (
      ts.isClassDeclaration(node) && node.name?.text === 'Window'
      || ts.isExpressionWithTypeArguments(node) && ts.isIdentifier(node.expression) && node.expression.text === 'Window'
    ) {
      const name = ts.isClassDeclaration(node) ? node.name : node.expression
      edits.push([name.getStart(source), name.end, 'RmmzWindow'])
    }
    if (ts.isIdentifier(node) && node.text === 'StorageManager'
      && (!ts.isPropertyAccessExpression(node.parent) || node.parent.expression === node)) {
      edits.push([node.getStart(source), node.end, 'RmmzStorageManager'])
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require') {
      // A bare require call makes TypeScript bind this classic script as CommonJS.
      edits.push([node.expression.getStart(source), node.expression.end, '(require)'])
    }
    if (ts.isExpressionStatement(node) && ts.isBinaryExpression(node.expression)) {
      const { left, right, operatorToken } = node.expression
      if (operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isClassExpression(right)) {
        const qualified = left.getText(source)
        const name = nestedClasses.get(qualified)
        if (name && right.name) {
          edits.push([left.getStart(source), right.name.end, `class ${name}`])
          edits.push([right.end, node.end, `\n${qualified} = ${name};`])
        }
      }
    }
    if (ts.isMethodDeclaration(node) && node.parameters.length === 0 && node.body) {
      const hasParamTag = node.jsDoc?.some(doc => doc.tags?.some(ts.isJSDocParameterTag))
      if (hasParamTag) {
        const openParen = source.text.indexOf('(', node.name.end)
        const closeParen = source.text.indexOf(')', openParen + 1)
        if (openParen !== -1 && closeParen !== -1 && closeParen < node.body.getStart(source)) {
          const inside = source.text.slice(openParen + 1, closeParen).trim()
          const match = /^\/\*\s*([A-Za-z_$][\w$]*(?:\s*,\s*[A-Za-z_$][\w$]*)*)\s*\*\/$/.exec(inside)
          if (match) {
            edits.push([openParen + 1, closeParen, match[1]])
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  if (!edits.length) return source
  return ts.createSourceFile(
    source.fileName,
    applyEdits(source.text, edits),
    source.languageVersion,
    true,
    ts.ScriptKind.JS,
  )
}

function formatDeclaration(fileName, text) {
  const declaration = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true)
  const edits = []
  const additions = new Map()

  for (const node of declaration.statements) {
    if (ts.isClassDeclaration(node) && qualifiedClasses.has(node.name?.text)) {
      const [namespace, name] = qualifiedClasses.get(node.name.text).split('.')
      const declare = node.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.DeclareKeyword)
      const body = applyEdits(text.slice(node.getFullStart(), node.end), [
        [declare.getStart() - node.getFullStart(), node.name.getStart() - node.getFullStart(), 'class '],
        [node.name.getStart() - node.getFullStart(), node.name.end - node.getFullStart(), name],
      ])
      if (!additions.has(namespace)) additions.set(namespace, [])
      additions.get(namespace).push(body.trim().replace(/^/gm, '    '))
      edits.push([node.getFullStart(), node.end, ''])
    } else if (
      ts.isExportDeclaration(node) && !node.moduleSpecifier
      && node.exportClause && ts.isNamedExports(node.exportClause) && !node.exportClause.elements.length
    ) {
      edits.push([node.getFullStart(), node.end, ''])
    } else if (ts.isModuleDeclaration(node) && ts.isModuleBlock(node.body)) {
      for (const member of node.body.statements) {
        if (
          ts.isExportDeclaration(member) && !member.moduleSpecifier
          && member.exportClause && ts.isNamedExports(member.exportClause)
          && member.exportClause.elements.every(element => qualifiedClasses.has(element.propertyName?.text))
        ) {
          edits.push([member.getFullStart(), member.end, ''])
        }
      }
    }
  }

  for (const [namespace, classes] of additions) {
    const body = classes.join('\n')
    text += `declare namespace ${namespace} {\n${body}\n}\n`
  }
  text = applyEdits(text, edits)

  const result = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true)
  const references = []
  function rewriteClassMembers(classNode, className) {
    const overloadMethods = polymorphicOverloadMethods.get(className)
    for (const member of classNode.members) {
      if (!ts.isMethodDeclaration(member) || !member.name || !ts.isIdentifier(member.name)) continue
      const methodName = member.name.text
      if (methodName === 'initialize' && polymorphicZeroArgInitialize.has(className) && member.parameters.length === 0) {
        const openParen = text.indexOf('(', member.name.end)
        const closeParen = text.indexOf(')', openParen + 1)
        if (openParen !== -1 && closeParen !== -1) {
          references.push([openParen + 1, closeParen, '...args: never[]'])
        }
      } else if (overloadMethods?.has(methodName)) {
        const lineStart = text.lastIndexOf('\n', member.getStart(result)) + 1
        const indent = text.slice(lineStart, member.getStart(result))
        references.push([member.end, member.end, `\n${indent}${methodName}(...args: any[]): void;`])
      }
    }
  }
  function replaceReferences(node) {
    if (ts.isClassDeclaration(node) && node.name) {
      const className = qualifiedClasses.has(node.name.text)
        ? qualifiedClasses.get(node.name.text).split('.').pop()
        : node.name.text
      rewriteClassMembers(node, className)
    }
    const name = ts.isTypeReferenceNode(node)
      ? node.typeName
      : ts.isTypeQueryNode(node)
        ? node.exprName
        : ts.isExpressionWithTypeArguments(node)
          ? node.expression
          : undefined
    if (name && ts.isIdentifier(name) && qualifiedClasses.has(name.text)) {
      references.push([name.getStart(result), name.end, qualifiedClasses.get(name.text)])
    }
    ts.forEachChild(node, replaceReferences)
  }
  replaceReferences(result)
  const sourceName = basename(fileName).replace(/\.d\.ts$/, '.js')
  const header = '// Auto-generated from JSDoc in src/js/' + sourceName + ' via `pnpm build:types`. Do not edit manually.'
  return header + '\n\n' + applyEdits(text, references).trim() + '\n'
}

const config = ts.readConfigFile(project, ts.sys.readFile)
const parsed = config.error
  ? { errors: [config.error] }
  : ts.parseJsonConfigFileContent(config.config, ts.sys, projectDir, undefined, project)
const options = {
  ...(parsed.options ?? {}),
  moduleDetection: ts.ModuleDetectionKind.Legacy,
  declaration: true,
  emitDeclarationOnly: true,
  noEmit: false,
  isolatedModules: false,
  verbatimModuleSyntax: false,
  rootDir: runtimeSourceDir,
  outDir: typesOutputDir,
}
const fileNames = [
  resolve(typesOutputDir, 'env.d.ts'),
  resolve(typesOutputDir, 'rmmz_data.d.ts'),
  ...readdirSync(runtimeSourceDir)
    .filter(name => runtimeFilePattern.test(name))
    .sort()
    .map(name => resolve(runtimeSourceDir, name)),
]
const host = ts.createCompilerHost(options, true)

function failOnErrors(diagnostics) {
  const errors = diagnostics.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error)
  if (!errors.length) return
  console.error(ts.formatDiagnosticsWithColorAndContext(errors, host))
  process.exit(1)
}

failOnErrors(parsed.errors)
const getSourceFile = host.getSourceFile
host.getSourceFile = (fileName, ...args) => {
  const source = getSourceFile(fileName, ...args)
  return source && runtimeFilePattern.test(basename(fileName))
    ? prepareSource(source)
    : source
}

const output = new Map()
const program = ts.createProgram(fileNames, options, host)
const emit = program.emit(undefined, (fileName, text) => {
  output.set(fileName, formatDeclaration(fileName, text))
})
failOnErrors([...program.getOptionsDiagnostics(), ...program.getSyntacticDiagnostics(), ...emit.diagnostics])

for (const [fileName, text] of output) {
  if (check) {
    if (ts.sys.readFile(fileName) !== text) {
      console.error(`Outdated declaration: ${relative(projectDir, fileName)}`)
      process.exitCode = 1
    }
  } else {
    mkdirSync(dirname(fileName), { recursive: true })
    writeFileSync(fileName, text)
  }
}
