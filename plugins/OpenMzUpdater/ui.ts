import { detectUpdaterEnvironment } from './ui/env.ts';
import { attachUpdaterToSceneTitle } from './ui/scene-title.ts';

export function setupUpdater(): void {
  const env = detectUpdaterEnvironment();
  if (!env) return;
  attachUpdaterToSceneTitle(env);
}
