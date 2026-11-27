export const runtimeFormat = 'prototype';
export const manifestSchema = 3;
export const statePath = 'js/openmz.json';
export const coreScripts = [
  'main.js', 'rmmz_core.js', 'rmmz_managers.js', 'rmmz_objects.js',
  'rmmz_scenes.js', 'rmmz_sprites.js', 'rmmz_windows.js',
];

const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*))?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?$/i;

export function isVersion(value) {
  return typeof value === 'string' && versionPattern.test(value);
}

export function compareVersions(left, right) {
  const a = versionPattern.exec(left);
  const b = versionPattern.exec(right);
  if (!a || !b) throw new Error('Invalid semantic version.');
  for (let i = 1; i <= 3; i++) {
    if (Number(a[i]) !== Number(b[i])) return Number(a[i]) > Number(b[i]) ? 1 : -1;
  }
  if (a[4] === b[4]) return 0;
  if (!a[4] || !b[4]) return a[4] ? -1 : 1;
  const ap = a[4].split('.');
  const bp = b[4].split('.');
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    if (ap[i] === bp[i]) continue;
    if (ap[i] === undefined || bp[i] === undefined) return ap[i] === undefined ? -1 : 1;
    const an = /^\d+$/.test(ap[i]);
    const bn = /^\d+$/.test(bp[i]);
    if (an !== bn) return an ? -1 : 1;
    return (an ? Number(ap[i]) > Number(bp[i]) : ap[i] > bp[i]) ? 1 : -1;
  }
  return 0;
}
