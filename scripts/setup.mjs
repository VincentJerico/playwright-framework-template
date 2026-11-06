// Turns a copy of this template into a test project for your app. Safe to run again.
//
//   npm run setup -- --name acme-e2e --dev https://dev.acme.test \
//     [--staging https://staging.acme.test] [--prod https://acme.test] [--dir path/to/copy]
//
// It renames the package, points the environments in src/config/env.ts at your app (staging and
// prod default to the dev URL), and creates .env from .env.example. Then it prints what's left to do.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    name: { type: 'string' },
    dev: { type: 'string' },
    staging: { type: 'string' },
    prod: { type: 'string' },
    dir: { type: 'string', default: '.' },
  },
});

const fail = (msg) => {
  console.error(
    `setup: ${msg}\n\nUsage: npm run setup -- --name <package-name> --dev <url> [--staging <url>] [--prod <url>]`,
  );
  process.exit(1);
};

const { name, dev, dir } = values;
if (!name) fail('--name is required');
if (!/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) {
  fail(`"${name}" is not a valid npm package name (lowercase, no spaces)`);
}
if (!dev) fail('--dev is required');
const urls = { dev, staging: values.staging ?? dev, prod: values.prod ?? dev };
for (const [env, url] of Object.entries(urls)) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    fail(`--${env} "${url}" is not a URL`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol))
    fail(`--${env} must be http(s), got "${url}"`);
  urls[env] = parsed.origin;
}

// 1. package.json
const pkgPath = join(dir, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.name = name;
pkg.version = '0.1.0';
pkg.description = `End-to-end tests for ${urls.dev}, built on playwright-framework-template.`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// 2. Environments
const envPath = join(dir, 'src/config/env.ts');
const env = readFileSync(envPath, 'utf8');
const START = '// setup:environments:start';
const END = '// setup:environments:end';
const from = env.indexOf(START);
const to = env.indexOf(END);
if (from === -1 || to === -1 || to < from)
  fail(`couldn't find the ${START} / ${END} markers in ${envPath}`);
const block = [
  START,
  'const ENVIRONMENTS: Record<EnvName, EnvConfig> = {',
  ...Object.entries(urls).map(([e, url]) => `  ${e}: { baseURL: '${url}' },`),
  '};',
].join('\n');
writeFileSync(envPath, env.slice(0, from) + block + '\n' + env.slice(to));

// 3. .env (never overwrite one that exists: it may hold real values)
const dotenv = join(dir, '.env');
const created = !existsSync(dotenv);
if (created) copyFileSync(join(dir, '.env.example'), dotenv);

console.log(`Set up "${name}":
  package.json   name, version 0.1.0, description
  env.ts         dev ${urls.dev}, staging ${urls.staging}, prod ${urls.prod}
  .env           ${created ? 'created from .env.example' : 'already exists, left as is'}

Next:
  1. Set SAUCE_USERNAME and SAUCE_PASSWORD in .env, and as repository secrets for CI.
     Your app isn't the demo, so the run stops until they're set. (Rename them in src/config/env.ts
     and .github/workflows/playwright.yml if you like.)
  2. Replace the demo page objects in src/pages/ and the specs in tests/ with your app's.
     Keep src/support/, the fixtures pattern and selftest/.
  3. Update src/config/users.ts and src/data/products.ts, or delete them.
  4. npm run typecheck && npx playwright test --project=setup --project=chromium`);
