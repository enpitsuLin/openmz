import { emitEngineSource } from '../../scripts/emit-engine.ts';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext, Script } from 'node:vm';
import { afterAll, beforeAll, test } from 'vitest';
import { Lang, parse as parseAst } from '@ast-grep/napi';
import { buildRuntime, buildUpdater } from '../../scripts/build.ts';
import {
  restorePixiInitializers,
  transformClasses,
} from '../../scripts/transform-classes.ts';

const root = await mkdtemp(join(tmpdir(), 'openmz-build-'));
let runtime: Awaited<ReturnType<typeof buildRuntime>>;
let updater: string;
beforeAll(async () => {
  runtime = await buildRuntime({
    outDir: join(root, 'runtime'),
    version: '1.2.3',
  });
  updater = await buildUpdater({ outDir: join(root, 'plugins') });
});
afterAll(() => rm(root, { recursive: true, force: true }));

function load(
  source: string,
  globals: Record<string, any> = {},
  transform: boolean = true,
) {
  const context = { ...globals };
  runInNewContext(transform ? transformClasses(source) : source, context);
  return context;
}

function assertModernScript(source: string, filename: string) {
  new Script(source, { filename });
  const root = parseAst(Lang.JavaScript, source).root();
  assert.equal(
    root.findAll({
      rule: {
        kind: 'identifier',
        regex: '^__(awaiter|generator|values|read|spreadArray)$',
      },
    }).length,
    0,
    `${filename}: unexpected TypeScript helpers`,
  );
  return root;
}

function assertPrototypeScript(source: string, filename: string) {
  const root = assertModernScript(source, filename);
  assert.equal(
    root.findAll({
      rule: { any: [{ kind: 'class_declaration' }, { kind: 'class' }] },
    }).length,
    0,
    filename,
  );
  const strictDirectives = root
    .findAll({ rule: { kind: 'expression_statement' } })
    .filter((statement) => {
      const text = statement
        .children()
        .find((node) => node.kind() === 'string')
        ?.text();
      return text === '"use strict"' || text === "'use strict'";
    });
  assert.equal(
    strictDirectives.length,
    0,
    `${filename}: unexpected strict mode`,
  );
}

test('preserves super receivers, static fields, lexical this and native async plugin hooks', async () => {
  const source = `
    class Base {
      static LIMIT = 10;
      constructor(value) { this.value = value; }
      get score() { return this.value; }
      set score(value) { this.value = value; }
      describe() { return this.value + 1; }
      static label() { return this.LIMIT; }
    }
    class Child extends Base {
      static BONUS = Base.LIMIT + 2;
      constructor(value) {
        const initial = value + 1;
        super(initial);
        this.arrow = () => this.value;
        this.callback = function() { return this.value; };
      }
      get score() { return super.score * 2; }
      set score(value) { super.score = value / 2; }
      setBase(value) { return super.score = value; }
      describe() { return super.describe() * 2; }
      static async label() { return super.label() + this.BONUS; }
    }
    class Leaf extends Child {
      constructor(value) { super(value); }
    }
    Object.assign(globalThis, { Base, Child, Leaf });
  `;
  for (const transform of [false, true]) {
    const { Base, Child, Leaf } = load(source, {}, transform);
    const item = new Leaf(4);
    assert(
      item instanceof Leaf && item instanceof Child && item instanceof Base,
    );
    assert.equal(item.constructor.name, 'Leaf');
    assert.equal(item.score, 10);
    item.score = 18;
    assert.equal(item.value, 9);
    assert.equal(item.arrow(), 9);
    assert.equal(item.callback.call({ value: 42 }), 42);
    assert.equal(item.setBase(6), 6);
    Base.prototype.describe = function () {
      return this.value + 10;
    };
    assert.equal(item.describe(), 32);
    assert.equal(await Leaf.label(), 22);
    assert.equal(Child.label.constructor.name, 'AsyncFunction');
    assert.match(item.arrow.toString(), /=>/);
    const accessor = Object.getOwnPropertyDescriptor(Child.prototype, 'score')!;
    assert.equal(typeof accessor.get, 'function');
    assert.equal(typeof accessor.set, 'function');
    assert.equal(accessor.enumerable, false);
  }
});

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

test('preserves the real string formatter in the runtime', async () => {
  const source = await readFile(
    join(runtime.outDir, 'js/rmmz_core.js'),
    'utf8',
  );
  const assignment = parseAst(Lang.JavaScript, source)
    .root()
    .find('String.prototype.format = $FN')!;
  const result = runInNewContext(
    `${assignment.text()};\n"Map%1.json".format(7);`,
    {},
  );
  assert.equal(result, 'Map7.json');
});

test('emits flat functions with legacy non-strict global assignment behavior', () => {
  const source = `
    engineGlobal = null;
    class Example {
      constructor(...args) { this.args = args; }
      assign() { legacyClassGlobal = true; }
    }
    globalThis.Example = Example;
  `;
  const transformed = transformClasses(source);
  const declarations = parseAst(Lang.JavaScript, transformed).root().children();
  assert(
    declarations.some(
      (node) =>
        node.kind() === 'function_declaration' &&
        node.field('name')!.text() === 'Example',
    ),
  );
  const context = load(source);
  assert.equal(context.engineGlobal, null);
  assert.equal(new context.Example(1).args[0], 1);
  new context.Example().assign();
  assert.equal(context.legacyClassGlobal, true);
});

test('handles anonymous classes and implicit constructors on an existing receiver', () => {
  const { Base, Child, Leaf } = load(`
    const Base = class {
      constructor(value = 3) { this.value = value; this.owner = () => this; }
    };
    let Child;
    Child = class extends Base {};
    const Leaf = class extends Child {};
    Object.assign(globalThis, { Base, Child, Leaf });
  `);
  const item = Object.create(Leaf.prototype);
  Leaf.call(item, 9);
  assert.equal(item.value, 9);
  assert.equal(item.owner(), item);
  assert(item instanceof Base && item instanceof Child && item instanceof Leaf);
  assert.equal(Base.name, 'Base');
  assert.equal(Child.name, 'Child');
  assert.equal(Leaf.name, 'Leaf');
  assert.equal(new Leaf().value, 3);
});

test('flattens named class expressions with distinct internal bindings', () => {
  const source = `
    const Layer = 'outer';
    const holder = {};
    holder.Layer = class Layer {
      static SIZE = 16;
      constructor() { this.size = Layer.SIZE; }
      reference() { return Layer; }
      record() { return { Layer }; }
    };
    holder.Other = class Layer {
      static SIZE = 32;
      constructor() { this.size = Layer.SIZE; }
    };
    globalThis.holder = holder;
    globalThis.outerLayer = Layer;
  `;
  const transformed = transformClasses(source);
  const functions = parseAst(Lang.JavaScript, transformed)
    .root()
    .findAll({ rule: { kind: 'variable_declarator' } })
    .filter((node) => node.field('value')?.kind() === 'function_expression');
  assert.equal(functions.length, 2);
  const context = load(source);
  assert.equal(context.Layer, undefined);
  assert.equal(context.outerLayer, 'outer');
  const { holder } = context;
  const Original = holder.Layer;
  const instance = new Original();
  assert.equal(instance.size, 16);
  assert.equal(new holder.Other().size, 32);
  assert.equal(instance.constructor.name, 'Layer');
  holder.Layer = function Replacement() {};
  assert.equal(instance.reference(), Original);
  assert.equal(instance.record().Layer, Original);
});

test('initializes Pixi state exactly once through new and legacy initialize calls', () => {
  function PixiSprite(this: Record<string, any>) {
    this.calls = (this.calls ?? 0) + 1;
    this.owner = () => this;
  }
  const source = `
    class Sprite extends PIXI.Sprite {
      constructor(...args) {
        super();
        this.allowChildren = true;
        this.initialize(...args);
      }
      initialize(bitmap) { this.bitmap = bitmap; }
    }
    class Child extends Sprite {
      constructor(...args) { super(...args); }
      initialize(bitmap) { super.initialize(bitmap); this.ready = true; }
    }
    Object.assign(globalThis, { Sprite, Child });
  `;
  const { Sprite, Child } = load(restorePixiInitializers(source), {
    PIXI: { Sprite: PixiSprite },
  });
  const normal = new Child('normal');
  const { Legacy } = load(
    `
    function Legacy(bitmap) { Child.prototype.initialize.call(this, bitmap); }
    Legacy.prototype = Object.create(Child.prototype);
    Legacy.prototype.constructor = Legacy;
    globalThis.Legacy = Legacy;
  `,
    { Child },
    false,
  );
  const legacy = new Legacy('legacy');
  for (const item of [normal, legacy]) {
    assert.equal(item instanceof Sprite && item instanceof PixiSprite, true);
    assert.equal(item.calls, 1);
    assert.equal(item.owner(), item);
    assert.equal(item.allowChildren, true);
    assert.equal(item.ready, true);
  }
  assert.equal(normal.bitmap, 'normal');
  assert.equal(legacy.bitmap, 'legacy');
});

test('builds a complete prototype runtime without syntax downleveling or TypeScript helpers', async () => {
  assert(runtime.files.includes('js/libs/pixi.js'));
  assert(runtime.files.includes('js/libs/effekseer.wasm'));
  assert(runtime.files.includes('js/openmz.json'));
  assert(!runtime.files.some((path) => path.startsWith('js/plugins')));
  for (const file of runtime.files.filter((path) => path.endsWith('.js'))) {
    const source = await readFile(join(runtime.outDir, file), 'utf8');
    if (file === 'js/libs/pixi.js') {
      assert(
        source.startsWith(`/*! PixiJS v${runtime.metadata.pixiVersion} |`),
      );
      const banner = source.slice(0, source.indexOf('*/'));
      assert(
        banner.includes(`Modified by OpenMZ v${runtime.metadata.version}`),
      );
    }
    if (file.startsWith('js/rmmz_')) {
      const original = await readFile(
        new URL(
          `../../src/${file.slice(3).replace(/\.js$/, '.ts')}`,
          import.meta.url,
        ),
        'utf8',
      );
      assert.equal(source.split('\n')[0], original.split('\n')[0]);
    }
    if (file === 'js/main.js') {
      const tree = assertModernScript(source, file);
      assert(
        tree
          .findAll({ rule: { kind: 'class_declaration' } })
          .some((node) => node.field('name')?.text() === 'Main'),
      );
      assert.equal(
        source,
        emitEngineSource(
          await readFile(new URL('../../src/main.ts', import.meta.url), 'utf8'),
        ),
      );
    } else if (file.startsWith('js/libs/') && file !== 'js/libs/pixi.js')
      assertModernScript(source, file);
    else assertPrototypeScript(source, file);
  }
  assert.deepEqual(
    JSON.parse(await readFile(join(runtime.outDir, 'js/openmz.json'), 'utf8')),
    runtime.metadata,
  );
  assert.equal(runtime.metadata.version, '1.2.3');
  assert.equal(runtime.metadata.format, 'prototype');
});

test('builds a standalone prototype updater that is inert outside RPG Maker', async () => {
  const source = await readFile(updater, 'utf8');
  assert.match(source, /@param manifestUrl/);
  assertPrototypeScript(source, 'OpenMzUpdater.js');
  assert.doesNotThrow(() => runInNewContext(source, {}));
});
