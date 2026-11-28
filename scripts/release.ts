import { execFileSync } from 'node:child_process';
import { globSync } from 'node:fs';
import { versionBump, versionBumpInfo, type VersionBumpRelease } from 'bumpp';

const files = ['packages/openmz/package.json', ...globSync('plugins/*/package.json').sort()];

function readGit(args: string[]) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

if (readGit(['status', '--porcelain'])) {
  throw new Error('Commit or stash your changes before releasing.');
}

const { state } = await versionBumpInfo({ files });
const { currentVersion, newVersion } = state;
if (newVersion === currentVersion) {
  console.log(`Version ${currentVersion} is unchanged.`);
  process.exit(0);
}

const tag = `v${newVersion}`;
const ref = `refs/tags/${tag}`;
if (readGit(['tag', '--list', tag]) || readGit(['ls-remote', '--refs', '--tags', 'origin', ref])) {
  throw new Error(`A release tag already exists for ${newVersion}.`);
}

await versionBump({
  files,
  release: newVersion as VersionBumpRelease,
  commit: 'chore(release): release v{version}',
  confirm: true,
  tag: false,
  push: false,
});

execFileSync('git', ['tag', '-a', tag, '-m', `Release ${tag}`], { stdio: 'inherit' });
execFileSync('git', ['push', '--no-follow-tags', 'origin', ref], { stdio: 'inherit' });
