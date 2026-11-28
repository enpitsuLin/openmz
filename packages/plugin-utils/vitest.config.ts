import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'plugin-utils',
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
