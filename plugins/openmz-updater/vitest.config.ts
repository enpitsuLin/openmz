import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'openmz-updater',
    environment: 'node',
    include: ['__test__/**/*.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
