import { defineConfig, devices } from '@playwright/test';
import { config, STORAGE_STATE } from './src/config/env.js';

/**
 * Production-grade Playwright config.
 * - `setup` project authenticates once and saves a storage state, reused by the browser projects.
 * - Cross-browser: chromium, firefox, webkit (+ a mobile project).
 * - Env-driven baseURL (TEST_ENV / BASE_URL). Reporters adapt to CI.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: config.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1) Authenticate once → save session to STORAGE_STATE.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // 2) Browser projects reuse the saved session (login specs opt out per-file).
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
