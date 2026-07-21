import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:3001';

// The workspace root, two levels up from apps/web-e2e.
const configDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(configDir, '../..');

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Kept self-contained (no `@nx/*` imports): Playwright loads this `.mts` file
 * through its own ESM loader, and requiring the CJS `@nx/devkit` /
 * `@nx/playwright/preset` from that context crashes on the current Node
 * (ERR_INTERNAL_ASSERTION). The only things we needed from the preset were the
 * test directory and the workspace root, both inlined above.
 */
export default defineConfig({
  testDir: './src',
  outputDir: resolve(workspaceRoot, 'dist/.playwright/apps/web-e2e/test-output'),
  reporter: [['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /*
   * Start both servers before the tests: the web app (:3001) AND the API
   * (:3000). The todo mutations run in the browser and call the API
   * cross-origin, so a full end-to-end run needs the backend up too.
   * With reuseExistingServer, already-running servers are attached to as-is.
   */
  webServer: [
    {
      command: 'npx nx run web:dev',
      url: 'http://localhost:3001',
      reuseExistingServer: true,
      timeout: 120_000,
      cwd: workspaceRoot,
    },
    {
      command: 'npx nx run api:serve',
      url: 'http://localhost:3000/api',
      reuseExistingServer: true,
      timeout: 120_000,
      cwd: workspaceRoot,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
