import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { pluginCompatServer } from './tests/plugin-compat/game-server.js';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.mjs'],
          testTimeout: 30_000,
          hookTimeout: 30_000,
        },
      },
      {
        plugins: [pluginCompatServer()],
        test: {
          name: 'plugin-compat',
          include: ['tests/plugin-compat/**/*.test.ts'],
          browser: {
            enabled: true,
            headless: true,
            viewport: { width: 1000, height: 800 },
            provider: playwright({
              launchOptions: {
                args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
              },
            }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
