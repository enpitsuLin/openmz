import { execFileSync } from 'node:child_process';
import { versionBump, versionBumpInfo, type VersionBumpRelease } from 'bumpp';

const files = ['packages/openmz/package.json', 'plugins/openmz-updater/package.json'];

function readGit(args: string[], input?: string) {
  return execFileSync('git', args, { encoding: 'utf8', input }).trim();
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

const tags = [`v${newVersion}`, `plugin/openmz-updater@v${newVersion}`];
const refs = tags.map((tag) => `refs/tags/${tag}`);
if (readGit(['tag', '--list', ...tags]) || readGit(['ls-remote', '--refs', '--tags', 'origin', ...refs])) {
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

const commit = readGit(['rev-parse', 'HEAD']);
const tagger = readGit(['var', 'GIT_COMMITTER_IDENT']);
const updates = tags.map((tag) => {
  const object = readGit(
    ['mktag'],
    `object ${commit}\ntype commit\ntag ${tag}\ntagger ${tagger}\n\nRelease v${newVersion}\n`,
  );
  return `create refs/tags/${tag} ${object}\n`;
});
readGit(['update-ref', '--stdin'], updates.join(''));
execFileSync('git', ['push', '--atomic', 'origin', ...refs], { stdio: 'inherit' });
