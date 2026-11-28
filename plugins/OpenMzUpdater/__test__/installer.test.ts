import type { TestContext } from 'vitest';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import { chmod, mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { test } from 'vitest';
import { isUpdaterError } from '../errors.ts';
import { applyUpgradePlan, planUpgrade } from '../installer.ts';

async function createTempProject(t: TestContext) {
  const dir = await mkdtemp(joinPath(tmpdir(), 'openmz-installer-'));
  t.onTestFinished(() => rm(dir, { recursive: true, force: true }));
  const projectRoot = path.join(dir, 'project');
  await mkdir(path.join(projectRoot, 'js'), { recursive: true });
  return { dir, projectRoot };
}

function joinPath(...parts: string[]) {
  return path.join(...parts);
}

test('planUpgrade rejects symlinked intermediate directories and symlinked target files', async (t) => {
  const { dir, projectRoot } = await createTempProject(t);
  const outside = path.join(dir, 'outside');
  await mkdir(outside, { recursive: true });
  await writeFile(path.join(outside, 'secret.js'), 'secret');

  await symlink(outside, path.join(projectRoot, 'js/libs'));
  assert.throws(
    () => planUpgrade(fs, path, projectRoot, [{ relativePath: 'js/libs/pixi.js', content: Buffer.from('new') }]),
    (error: unknown) => isUpdaterError(error) && error.code === 'UNSAFE_TARGET_PATH',
  );

  await symlink(path.join(outside, 'secret.js'), path.join(projectRoot, 'js/main.js'));
  assert.throws(
    () => planUpgrade(fs, path, projectRoot, [{ relativePath: 'js/main.js', content: Buffer.from('new') }]),
    (error: unknown) => isUpdaterError(error) && error.code === 'UNSAFE_TARGET_PATH',
  );
});

test('applyUpgradePlan preserves file modes and creates unique backup directories', async (t) => {
  const { projectRoot } = await createTempProject(t);
  const mainPath = path.join(projectRoot, 'js/main.js');
  await writeFile(mainPath, 'v1');
  await chmod(mainPath, 0o640);

  const plan1 = planUpgrade(fs, path, projectRoot, [{ relativePath: 'js/main.js', content: Buffer.from('v2') }]);
  const backup1 = applyUpgradePlan(fs, path, plan1);
  assert.equal(await readFile(mainPath, 'utf8'), 'v2');
  assert.equal((await stat(mainPath)).mode & 0o777, 0o640);
  assert.equal(await readFile(path.join(backup1, 'js/main.js'), 'utf8'), 'v1');

  const plan2 = planUpgrade(fs, path, projectRoot, [{ relativePath: 'js/main.js', content: Buffer.from('v3') }]);
  const backup2 = applyUpgradePlan(fs, path, plan2);
  assert.notEqual(backup1, backup2);
  assert.equal(await readFile(path.join(backup2, 'js/main.js'), 'utf8'), 'v2');
});

test('applyUpgradePlan surfaces ROLLBACK_INCOMPLETE when rollback restoration fails', async (t) => {
  const { projectRoot } = await createTempProject(t);
  await writeFile(path.join(projectRoot, 'js/a.js'), 'orig-a');
  await writeFile(path.join(projectRoot, 'js/b.js'), 'orig-b');

  const plan = planUpgrade(fs, path, projectRoot, [
    { relativePath: 'js/a.js', content: Buffer.from('new-a') },
    { relativePath: 'js/b.js', content: Buffer.from('new-b') },
  ]);

  let renameCount = 0;
  let copyCount = 0;
  const faultyFs: typeof fs = {
    ...fs,
    renameSync(source, target) {
      renameCount++;
      if (renameCount === 2) {
        throw new Error('Disk full during rename');
      }
      fs.renameSync(source, target);
    },
    copyFileSync(source, dest) {
      copyCount++;
      // First 2 copies are backups; 3rd copy is rollback restoration.
      if (copyCount === 3) {
        throw new Error('Permission denied during restore');
      }
      fs.copyFileSync(source, dest);
    },
  };

  assert.throws(
    () => applyUpgradePlan(faultyFs, path, plan),
    (error: unknown) =>
      isUpdaterError(error) &&
      error.code === 'ROLLBACK_INCOMPLETE' &&
      /Disk full during rename/.test(error.message) &&
      /Permission denied during restore/.test(error.message),
  );
});
