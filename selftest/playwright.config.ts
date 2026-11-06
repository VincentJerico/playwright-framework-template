import { defineConfig, devices } from '@playwright/test';
import { config } from '../src/config/env.js';

/** Runs only the planted failures, once each. Used by scripts/selftest.mjs. */
export default defineConfig({
  testDir: '.',
  testMatch: /planted\.spec\.ts$/,
  retries: 0,
  workers: 2,
  timeout: 15_000,
  expect: { timeout: 2_000 },
  reporter: [['json', { outputFile: '../test-results/selftest.json' }]],
  use: { ...devices['Desktop Chrome'], baseURL: config.baseURL, testIdAttribute: 'data-test' },
});
