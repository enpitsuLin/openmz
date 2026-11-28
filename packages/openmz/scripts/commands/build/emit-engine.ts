import { stripTypeScriptTypes } from 'node:module';
import { Lang, parse } from '@ast-grep/napi';

const names = new Map([
  ['RmmzWindow', 'Window'],
  ['RmmzStorageManager', 'StorageManager'],
]);
const methods = new Map([
  ['actorName', 'name'],
  ['inputName', 'name'],
]);
const nested = new Map([
  ['GraphicsFPSCounter', ['Graphics', 'FPSCounter']],
  ['TilemapLayer', ['Tilemap', 'Layer']],
  ['TilemapCombinedLayer', ['Tilemap', 'CombinedLayer']],
]);

export function emitEngineSource(source: string) {
  const javascript = stripTypeScriptTypes(source);
  let root = parse(Lang.JavaScript, javascript).root();
  const references = root
    .findAll({
      rule: { any: [{ kind: 'identifier' }, { kind: 'property_identifier' }] },
    })
    .flatMap((node) => {
      if (node.text() === 'actorName') {
        const owner = node
          .ancestors()
          .find((ancestor) => ancestor.kind() === 'class_declaration' || ancestor.kind() === 'class');
        if (owner?.field('name')?.text() !== 'Sprite_Name') return [];
      }
      const replacement = (node.kind() === 'identifier' ? names : methods).get(node.text());
      return replacement ? [node.replace(replacement)] : [];
    });
  const renamed = root.commitEdits(references);
  root = parse(Lang.JavaScript, renamed).root();
  const edits = [];
  for (const node of root.findAll({ rule: { kind: 'class_declaration' } })) {
    const name = node.field('name')!;
    const target = nested.get(name.text());
    if (!target) continue;
    const [owner, member] = target;
    const assignment = root.find(`${owner}.${member} = ${name.text()}`);
    if (!assignment) throw new Error(`Missing nested class assignment: ${owner}.${member}`);
    const body = node.text().slice(name.range().end.index - node.range().start.index);
    edits.push(node.replace(`${owner}.${member} = class ${member}${body};`));
    edits.push(assignment.parent()!.replace(''));
  }
  return root.commitEdits(edits);
}
