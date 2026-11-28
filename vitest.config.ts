import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts', 'packages/*/vitest.*.config.ts', 'plugins/*/vitest.config.ts'],
  },
});
