/**
 * Environment resolution. Select with TEST_ENV=dev|staging|prod (default: dev).
 * In a real project each environment points at a different base URL / data set; here they all
 * point at the SauceDemo demo so the template runs out of the box.
 */
export type EnvName = 'dev' | 'staging' | 'prod';

interface EnvConfig {
  baseURL: string;
}

const ENVIRONMENTS: Record<EnvName, EnvConfig> = {
  dev: { baseURL: 'https://www.saucedemo.com' },
  staging: { baseURL: 'https://www.saucedemo.com' },
  prod: { baseURL: 'https://www.saucedemo.com' },
};

export const ENV: EnvName = (process.env.TEST_ENV as EnvName) || 'dev';

export const config = {
  env: ENV,
  baseURL: process.env.BASE_URL || ENVIRONMENTS[ENV].baseURL,
  // Credentials come from env vars in CI; fall back to SauceDemo's public demo user locally.
  username: process.env.SAUCE_USERNAME || 'standard_user',
  password: process.env.SAUCE_PASSWORD || 'secret_sauce',
};

/** Where the reusable authenticated session is stored (see tests/auth.setup.ts). */
export const STORAGE_STATE = 'playwright/.auth/user.json';
