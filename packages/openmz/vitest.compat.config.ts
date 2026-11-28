import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { pluginCompatServer } from './tests/plugin-compat/game-server.ts';

export default defineConfig({
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
});
