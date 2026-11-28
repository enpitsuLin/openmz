import { equirectToCube, parseRadianceHdr } from '@pixi/3d';
import { hd2dAssetUrl } from '../constants.ts';

type SkyEnvironment = ReturnType<typeof equirectToCube>;

const SKY_ROTATION_Y = -Math.PI * 0.095;

let cachedEnvironment: Promise<SkyEnvironment> | null = null;

async function loadSkyboxEnvironment(): Promise<SkyEnvironment> {
  const url = hd2dAssetUrl('skybox.hdr');
  const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fail = () => reject(new Error(`Failed to load: ${url}`));
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status < 400 && xhr.response instanceof ArrayBuffer) resolve(xhr.response);
      else fail();
    };
    xhr.onerror = fail;
    xhr.send();
  });
  const panorama = parseRadianceHdr(buffer);
  const { width, height, data } = panorama;
  const stride = width * 3;
  const shift = Math.round((-SKY_ROTATION_Y * width) / (2 * Math.PI)) * 3;
  const wrapped = new Float32Array(shift);

  // Horizontal wrap preserves matching yaw for both sky background and IBL lighting.
  for (let y = 0; y < height; y++) {
    const start = y * stride;
    const end = start + stride;
    wrapped.set(data.subarray(end - shift, end));
    data.copyWithin(start + shift, start, end - shift);
    data.set(wrapped, start);
  }

  return equirectToCube(panorama, 512, 'skybox');
}

export function loadSkybox(): Promise<SkyEnvironment> {
  cachedEnvironment ??= loadSkyboxEnvironment().catch((error: unknown) => {
    cachedEnvironment = null;
    throw error;
  });
  return cachedEnvironment;
}
