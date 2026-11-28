import type { Stats } from 'node:fs';
import type { ArchiveEntry } from '../../shared/engine-release.ts';
import type { NodeModules, PlannedUpgradeFile, UpgradePlan } from './types.ts';
import { createUpdaterError, formatErrorMessage } from './errors.ts';

type FsModule = NodeModules['fs'];
type PathModule = NodeModules['path'];

function isErrno(error: unknown, code: string): boolean {
  return (error as NodeJS.ErrnoException | null)?.code === code;
}

/** Returns lstat of a regular file, `undefined` if missing, or throws for non-regular entries. */
function inspectTargetFile(fs: FsModule, filePath: string): Stats | undefined {
  let stat: Stats;
  try {
    stat = fs.lstatSync(filePath);
  } catch (error) {
    if (isErrno(error, 'ENOENT')) return undefined;
    throw error;
  }
  if (!stat.isFile()) {
    throw createUpdaterError(
      'UNSAFE_TARGET_PATH',
      `Unexpected filesystem entry: ${filePath}`,
    );
  }
  return stat;
}

/** Verifies every existing intermediate directory is a real directory (not a symlink or file). */
function inspectIntermediateDirectories(
  fs: FsModule,
  path: PathModule,
  root: string,
  segments: string[],
  checkedDirs: Set<string>,
): void {
  let current = root;
  for (let index = 0; index < segments.length - 1; index++) {
    current = path.join(current, segments[index]);
    if (checkedDirs.has(current)) continue;
    try {
      const stat = fs.lstatSync(current);
      if (!stat.isDirectory()) {
        throw createUpdaterError(
          'UNSAFE_TARGET_PATH',
          `Unexpected filesystem entry: ${current}`,
        );
      }
      checkedDirs.add(current);
    } catch (error) {
      if (isErrno(error, 'ENOENT')) {
        // Remaining nested directories do not exist yet and will be created safely.
        return;
      }
      throw error;
    }
  }
}

function removeDirectory(fs: FsModule, directory: string): void {
  if (fs.rmSync) {
    fs.rmSync(directory, { recursive: true, force: true });
  } else {
    fs.rmdirSync(directory, { recursive: true });
  }
}

export function formatBackupTimestamp(date: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-` +
    `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

function createBackupDir(fs: FsModule, path: PathModule, root: string): string {
  const base = path.join(root, 'js_backup', formatBackupTimestamp());
  fs.mkdirSync(path.dirname(base), { recursive: true });
  for (let suffix = 0; ; suffix++) {
    const candidate = suffix ? `${base}-${suffix}` : base;
    try {
      fs.mkdirSync(candidate);
      return candidate;
    } catch (error) {
      if (!isErrno(error, 'EEXIST')) throw error;
    }
  }
}

/**
 * Preflights every target path before mutating the project directory.
 * Rejects symlinked directories or non-regular target files.
 */
export function planUpgrade(
  fs: FsModule,
  path: PathModule,
  projectRoot: string,
  entries: ArchiveEntry[],
): UpgradePlan {
  const root = fs.realpathSync(projectRoot);
  const checkedDirs = new Set<string>();
  const files: PlannedUpgradeFile[] = entries.map(
    ({ relativePath, content }) => {
      const segments = relativePath.split('/');
      inspectIntermediateDirectories(fs, path, root, segments, checkedDirs);
      const targetPath = path.join(root, ...segments);
      return {
        relativePath,
        content,
        targetPath,
        stat: inspectTargetFile(fs, targetPath),
      };
    },
  );
  return { root, files };
}

/**
 * Applies an upgrade plan transactionally:
 * 1. Backs up all existing target files into a timestamped `js_backup/` directory.
 * 2. Writes each file to a staged temporary path, preserves original mode, and atomically renames.
 * 3. On any failure, restores backed-up files, removes newly added files and created directories.
 */
export function applyUpgradePlan(
  fs: FsModule,
  path: PathModule,
  plan: UpgradePlan,
): string {
  const { root, files } = plan;
  const backupDir = createBackupDir(fs, path, root);
  const stagedPath = path.join(backupDir, '.openmz-update');
  const backupPathOf = (file: PlannedUpgradeFile) =>
    path.join(backupDir, file.relativePath);

  const createdDirs: string[] = [];
  const applied: PlannedUpgradeFile[] = [];

  try {
    // Phase 1: Back up existing files before any destination is touched.
    for (const file of files) {
      if (!file.stat) continue;
      const destination = backupPathOf(file);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(file.targetPath, destination);
    }

    // Phase 2: Stage and atomically rename each target file.
    for (const file of files) {
      const createdDir = fs.mkdirSync(path.dirname(file.targetPath), {
        recursive: true,
      });
      if (createdDir) createdDirs.push(createdDir);

      fs.writeFileSync(stagedPath, file.content);
      if (file.stat) {
        fs.chmodSync(stagedPath, file.stat.mode & 0o777);
      }
      // Atomic rename ensures a failed write never leaves a partially written file.
      fs.renameSync(stagedPath, file.targetPath);
      applied.push(file);
    }
  } catch (error) {
    rollbackUpgrade(
      fs,
      backupDir,
      stagedPath,
      backupPathOf,
      applied,
      createdDirs,
      error,
    );
  }

  return backupDir;
}

function rollbackUpgrade(
  fs: FsModule,
  backupDir: string,
  stagedPath: string,
  backupPathOf: (file: PlannedUpgradeFile) => string,
  applied: PlannedUpgradeFile[],
  createdDirs: string[],
  originalError: unknown,
): never {
  const rollbackErrors: string[] = [];
  const attempt = (operation: () => unknown) => {
    try {
      operation();
    } catch (rollbackError) {
      rollbackErrors.push(formatErrorMessage(rollbackError));
    }
  };

  for (let index = applied.length - 1; index >= 0; index--) {
    const file = applied[index];
    attempt(() => {
      if (file.stat) {
        fs.copyFileSync(backupPathOf(file), file.targetPath);
      } else {
        fs.unlinkSync(file.targetPath);
      }
    });
  }

  attempt(() => {
    if (fs.existsSync(stagedPath)) fs.unlinkSync(stagedPath);
  });

  for (let index = createdDirs.length - 1; index >= 0; index--) {
    const directory = createdDirs[index];
    attempt(() => removeDirectory(fs, directory));
  }

  if (rollbackErrors.length) {
    throw createUpdaterError(
      'ROLLBACK_INCOMPLETE',
      `${formatErrorMessage(originalError)} Rollback incomplete. Backup: ${backupDir}. ${rollbackErrors.join(' | ')}`,
      {
        cause: originalError,
        details: { backupDir, rollbackErrors },
      },
    );
  }

  throw originalError;
}
