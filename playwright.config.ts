import { defineConfig, devices } from '@playwright/test';
import {
  API_DIR,
  API_PORT,
  FAKE_RAWG_PORT,
  WEB_PORT,
} from './e2e/support/e2e-config.ts';

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  // Every spec shares one API instance and one test database.
  workers: 1,
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: isCi ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    locale: 'pt-BR',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : [
        {
          command: 'node e2e/support/fake-rawg-server.ts',
          port: FAKE_RAWG_PORT,
          env: { PORT: String(FAKE_RAWG_PORT) },
        },
        {
          // Recreates the test database, then serves the API against the fake catalog.
          command: 'npm run e2e:serve',
          cwd: API_DIR,
          url: `http://localhost:${API_PORT}/health`,
          timeout: 180_000,
          env: {
            E2E_API_PORT: String(API_PORT),
            E2E_RAWG_BASE_URL: `http://localhost:${FAKE_RAWG_PORT}`,
            E2E_FRONTEND_URL: `http://localhost:${WEB_PORT}`,
          },
        },
        {
          command: `npx vite --port ${WEB_PORT} --strictPort`,
          url: `http://localhost:${WEB_PORT}`,
          env: { API_PROXY_TARGET: `http://localhost:${API_PORT}` },
        },
      ],
});
