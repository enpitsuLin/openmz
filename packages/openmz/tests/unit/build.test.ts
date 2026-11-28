import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext, Script } from 'node:vm';
import { afterAll, beforeAll, test } from 'vitest';
import { Lang, parse as parseAst } from '@ast-grep/napi';
import { transformClasses } from '@openmz-internal/build-utils';
import { emitEngineSource } from '../../scripts/commands/build/emit-engine.ts';
import { buildRuntime } from '../../scripts/commands/build/runtime.ts';

const root = await mkdtemp(join(tmpdir(), 'openmz-build-'));
let runtime: Awaited<ReturnType<typeof buildRuntime>>;
beforeAll(async () => {
  runtime = await buildRuntime({
    outDir: join(root, 'runtime'),
    version: '1.2.3',
  });
});
afterAll(() => rm(root, { recursive: true, force: true }));

function load(source: string, globals: Record<string, any> = {}, transform: boolean = true) {
  const context = { ...globals };
  runInNewContext(transform ? transformClasses(source) : source, context);
  return context;
}

function parseValidScript(source: string, filename: string) {
  new Script(source, { filename });
  return parseAst(Lang.JavaScript, source).root();
}

function assertPrototypeScript(source: string, filename: string) {
  const root = parseValidScript(source, filename);
  assert.equal(
    root.findAll({
      rule: { any: [{ kind: 'class_declaration' }, { kind: 'class' }] },
    }).length,
    0,
    filename,
  );
  const strictDirectives = root.findAll({ rule: { kind: 'expression_statement' } }).filter((statement) => {
    const text = statement
      .children()
      .find((node) => node.kind() === 'string')
      ?.text();
    return text === '"use strict"' || text === "'use strict'";
  });
  assert.equal(strictDirectives.length, 0, `${filename}: unexpected strict mode`);
}

test('erases TypeScript fields and preserves RPG Maker method names', () => {
  const source = emitEngineSource(`
    interface State { value: number; }
    class Base {
      constructor() { this.initialize(); }
      initialize(): void {}
    }
    class Child extends Base {
      declare value: number;
      initialize(): void { this.value = 42; }
    }
    class Window_Base {
      actorName(id: number): string { return 'Actor ' + id; }
    }
    class Sprite_Name {
      actorName(): string { return 'Actor'; }
      displayName(): string { return this.actorName(); }
    }
    Object.assign(globalThis, { Child, Window_Base, Sprite_Name });
  `);
  const transformed = transformClasses(source);
  assertPrototypeScript(transformed, 'typed-engine.js');
  const context = load(source);
  assert.equal(new context.Child().value, 42);
  assert.equal(new context.Window_Base().actorName(3), 'Actor 3');
  const sprite = new context.Sprite_Name();
  assert.equal(sprite.name(), 'Actor');
  assert.equal(sprite.displayName(), 'Actor');
});

test('preserves prototype.initialize on every instantiable vanilla MZ class', async () => {
  const removedInPixi8 = new Set(['Tilemap.Renderer']);
  const coreFiles = [
    'rmmz_core.js',
    'rmmz_managers.js',
    'rmmz_objects.js',
    'rmmz_scenes.js',
    'rmmz_sprites.js',
    'rmmz_windows.js',
  ];
  for (const file of coreFiles) {
    const vanilla = await readFile(new URL(`../../../../vendor/js/${file}`, import.meta.url), 'utf8');
    const built = await readFile(join(runtime.outDir, 'js', file), 'utf8');
    const aliases = new Map<string, string>();
    for (const match of built.matchAll(/^([A-Z][\w.]*) = (_openmz_[\w$]+);$/gm)) {
      aliases.set(match[2], match[1]);
    }
    const builtInits = new Set<string>();
    for (const match of built.matchAll(/^([A-Za-z_][\w.$]*)\.prototype\.initialize =/gm)) {
      builtInits.add(aliases.get(match[1]) ?? match[1]);
    }
    const missing: string[] = [];
    for (const match of vanilla.matchAll(/^([A-Z][\w.]*)\.prototype\.initialize =/gm)) {
      const name = match[1];
      if (removedInPixi8.has(name)) continue;
      if (!builtInits.has(name)) missing.push(name);
    }
    assert.deepEqual(missing, [], `${file}: missing prototype.initialize`);
  }
});

test('builds a complete prototype runtime', async () => {
  assert(runtime.files.includes('js/libs/pixi.js'));
  assert(runtime.files.includes('js/libs/effekseer.wasm'));
  assert(runtime.files.includes('js/openmz.json'));
  assert(!runtime.files.some((path) => path.startsWith('js/plugins')));
  for (const file of runtime.files.filter((path) => path.endsWith('.js'))) {
    const source = await readFile(join(runtime.outDir, file), 'utf8');
    if (file === 'js/main.js') {
      const tree = parseValidScript(source, file);
      assert(
        tree.findAll({ rule: { kind: 'class_declaration' } }).some((node) => node.field('name')?.text() === 'Main'),
      );
    } else if (file.startsWith('js/libs/') && file !== 'js/libs/pixi.js') parseValidScript(source, file);
    else assertPrototypeScript(source, file);
  }
  assert.deepEqual(JSON.parse(await readFile(join(runtime.outDir, 'js/openmz.json'), 'utf8')), runtime.metadata);
  assert.equal(runtime.metadata.version, '1.2.3');
  assert.equal(runtime.metadata.format, 'prototype');
});
