import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext, Script } from 'node:vm';
import { afterAll, beforeAll, test } from 'vitest';
import { Lang, parse as parseAst } from '@ast-grep/napi';
import { buildRuntime, buildUpdater } from '../../scripts/build.mjs';
import { restorePixiInitializers, transformClasses } from '../../scripts/transform-classes.mjs';

const root = await mkdtemp(join(tmpdir(), 'openmz-build-'));
let runtime;
let updater;
beforeAll(async () => {
  runtime = await buildRuntime({ outDir: join(root, 'runtime'), version: '1.2.3' });
  updater = await buildUpdater({ outDir: join(root, 'plugins') });
});
afterAll(() => rm(root, { recursive: true, force: true }));

function load(source, globals = {}, transform = true) {
  const context = { ...globals };
  runInNewContext(transform ? transformClasses(source) : source, context);
  return context;
}

function assertModernScript(source, filename) {
  new Script(source, { filename });
  const root = parseAst(Lang.JavaScript, source).root();
  assert.equal(root.findAll({ rule: {
    kind: 'identifier', regex: '^__(awaiter|generator|values|read|spreadArray)$',
  } }).length, 0, `${filename}: unexpected TypeScript helpers`);
  return root;
}

function assertPrototypeScript(source, filename) {
  const root = assertModernScript(source, filename);
  assert.equal(root.findAll({ rule: { any: [{ kind: 'class_declaration' }, { kind: 'class' }] } }).length, 0, filename);
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
    assert(item instanceof Leaf && item instanceof Child && item instanceof Base);
    assert.equal(item.constructor.name, 'Leaf');
    assert.equal(item.score, 10);
    item.score = 18;
    assert.equal(item.value, 9);
    assert.equal(item.arrow(), 9);
    assert.equal(item.callback.call({ value: 42 }), 42);
    assert.equal(item.setBase(6), 6);
    Base.prototype.describe = function() { return this.value + 10; };
    assert.equal(item.describe(), 32);
    assert.equal(await Leaf.label(), 22);
    assert.equal(Child.label.constructor.name, 'AsyncFunction');
    assert.match(item.arrow.toString(), /=>/);
    const accessor = Object.getOwnPropertyDescriptor(Child.prototype, 'score');
    assert.equal(typeof accessor.get, 'function');
    assert.equal(typeof accessor.set, 'function');
    assert.equal(accessor.enumerable, false);
  }
});

test('preserves the real string formatter in the runtime', async () => {
  const source = await readFile(join(runtime.outDir, 'js/rmmz_core.js'), 'utf8');
  const assignment = parseAst(Lang.JavaScript, source).root().find('String.prototype.format = $FN');
  const result = runInNewContext(`${assignment.text()};\n"Map%1.json".format(7);`, {});
  assert.equal(result, 'Map7.json');
});

test('keeps class strictness local to allow classic-script global initialization', () => {
  const { engineGlobal, Example } = load(`
    engineGlobal = null;
    class Example {
      constructor(...args) { this.args = args; }
      assign() { missingClassGlobal = true; }
    }
    globalThis.Example = Example;
  `);
  assert.equal(engineGlobal, null);
  assert.equal(new Example(1).args[0], 1);
  assert.throws(() => new Example().assign(), /missingClassGlobal is not defined/);
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
  assert.equal(new Leaf().value, 3);
});

test('keeps named class expressions local', () => {
  const { holder, Layer } = load(`
    const holder = {};
    holder.Layer = class Layer {
      static SIZE = 16;
      constructor() { this.size = Layer.SIZE; }
    };
    globalThis.holder = holder;
  `);
  assert.equal(Layer, undefined);
  assert.equal(new holder.Layer().size, 16);
});

test('initializes Pixi state exactly once through new and legacy initialize calls', () => {
  function PixiSprite() {
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
  const { Sprite, Child } = load(restorePixiInitializers(source), { PIXI: { Sprite: PixiSprite } });
  const normal = new Child('normal');
  function Legacy(bitmap) { Child.prototype.initialize.call(this, bitmap); }
  Legacy.prototype = Object.create(Child.prototype);
  Legacy.prototype.constructor = Legacy;
  const legacy = new Legacy('legacy');
  for (const item of [normal, legacy]) {
    assert(item instanceof Sprite && item instanceof PixiSprite);
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
  assert(!runtime.files.some(path => path.startsWith('js/plugins')));
  for (const file of runtime.files.filter(path => path.endsWith('.js'))) {
    const source = await readFile(join(runtime.outDir, file), 'utf8');
    if (file.startsWith('js/libs/') && file !== 'js/libs/pixi.js') assertModernScript(source, file);
    else assertPrototypeScript(source, file);
  }
  assert.deepEqual(JSON.parse(await readFile(join(runtime.outDir, 'js/openmz.json'), 'utf8')), runtime.metadata);
  assert.equal(runtime.metadata.version, '1.2.3');
  assert.equal(runtime.metadata.format, 'prototype');
});

test('builds a standalone prototype updater that is inert outside RPG Maker', async () => {
  const source = await readFile(updater, 'utf8');
  assert.match(source, /@param manifestUrl/);
  assertPrototypeScript(source, 'OpenMzUpdater.js');
  assert.doesNotThrow(() => runInNewContext(source, {}));
});
