import type { CameraSettings } from './scene/camera.ts';
import type { DustSettings } from './scene/dust.ts';
import type { FogSettings } from './scene/fog.ts';
import type { PostProcessingSettings } from './scene/postProcessing.ts';

export interface PersistedHd2dState {
  post?: PostProcessingSettings;
  fog?: FogSettings;
  dust?: DustSettings;
  camera?: CameraSettings;
}

export const persistedHd2dState: PersistedHd2dState = {};
