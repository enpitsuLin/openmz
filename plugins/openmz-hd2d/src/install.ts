import { installPluginCommands } from './patches/PluginCommands.ts';
import { installSceneMapPatch } from './patches/Scene_Map.ts';

export function installHd2d(): void {
  installSceneMapPatch();
  installPluginCommands();
}
