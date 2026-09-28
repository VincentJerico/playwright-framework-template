import { existsSync } from 'node:fs';

/**
 * Environment resolution. Select with TEST_ENV=dev|staging|prod (default: dev).
 * In a real project each environment points at a different base URL / data set; here they all
 * point at the SauceDemo demo so the template runs out of the box.
 * Variables come from the shell first, then from `.env` at the repo root (see .env.example).
 */
const DOTENV = new URL('../../.env', import.meta.url);
if (existsSync(DOTENV)) process.loadEnvFile(DOTENV);

export type EnvName = 'dev' | 'staging' | 'prod';

interface EnvConfig {
  baseURL: string;
}

const ENVIRONMENTS: Record<EnvName, EnvConfig> = {
  dev: { baseURL: 'https://www.saucedemo.com' },
  staging: { baseURL: 'https://www.saucedemo.com' },
  prod: { baseURL: 'https://www.saucedemo.com' },
};

function resolveEnv(name: string): EnvName {
  if (Object.hasOwn(ENVIRONMENTS, name)) return name as EnvName;
  throw new Error(
    `Unknown TEST_ENV "${name}". Valid names: ${Object.keys(ENVIRONMENTS).join(', ')}.`,
  );
}

const ENV = resolveEnv(process.env.TEST_ENV || 'dev');
const baseURL = process.env.BASE_URL || ENVIRONMENTS[ENV].baseURL;
const isDemo = new URL(baseURL).hostname === 'www.saucedemo.com';

// The fallbacks are SauceDemo's public demo credentials, printed on its login page. They are
// never right for another target, so any other base URL must supply its own.
function credential(name: 'SAUCE_USERNAME' | 'SAUCE_PASSWORD', demoValue: string): string {
  const value = process.env[name];
  if (value) return value;
  if (isDemo) return demoValue;
  throw new Error(
    `${name} is not set. ${baseURL} is not the SauceDemo demo, so its public credentials do not apply.`,
  );
}

export const config = {
  baseURL,
  username: credential('SAUCE_USERNAME', 'standard_user'),
  password: credential('SAUCE_PASSWORD', 'secret_sauce'),
};

/** Where the reusable authenticated session is stored (see tests/auth.setup.ts). */
export const STORAGE_STATE = 'playwright/.auth/user.json';
