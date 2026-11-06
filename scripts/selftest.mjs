// Self-test for the framework's guards: runs selftest/planted.spec.ts and passes only if every
// planted test fails, and fails for its own reason (not a typo or a crash elsewhere).
//
//   npm run selftest
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';

// Planted test id (the [tag] in its title) -> text its failure message must contain.
const EXPECTED = {
  'sorted-by-price': 'to be sorted asc',
  'sorted-needs-two': 'needs at least 2 values',
  'sorted-alpha': 'to be sorted desc',
  'money-parse': 'No dollar amount in "Total: free"',
  'page-assertion': 'toContainText',
};

spawnSync('npx', ['playwright', 'test', '-c', 'selftest/playwright.config.ts'], {
  stdio: 'inherit',
});

const report = JSON.parse(readFileSync('test-results/selftest.json', 'utf8'));
const results = new Map();
const collect = (suite) => {
  for (const spec of suite.specs ?? []) {
    const id = spec.title.match(/^\[([\w-]+)\]/)?.[1];
    const result = spec.tests[0]?.results.at(-1);
    results.set(id, {
      status: result?.status,
      message: (result?.errors ?? []).map((e) => e.message ?? '').join('\n'),
    });
  }
  for (const child of suite.suites ?? []) collect(child);
};
report.suites.forEach(collect);

let ok = true;
for (const [id, needle] of Object.entries(EXPECTED)) {
  const r = results.get(id);
  // Strip colour codes so the needle matches the plain message.
  const message = stripVTControlCharacters(r?.message ?? '');
  const pass = r?.status === 'failed' && message.includes(needle);
  ok &&= pass;
  console.log(
    `${pass ? 'PASS' : 'FAIL'}  ${id}: ${
      !r
        ? 'planted test not found'
        : r.status !== 'failed'
          ? `expected to fail, ${r.status}`
          : pass
            ? 'failed as planted'
            : `failed for another reason:\n${message}`
    }`,
  );
}
for (const id of results.keys()) {
  if (!(id in EXPECTED)) {
    ok = false;
    console.log(`FAIL  ${id}: planted test has no expected reason in scripts/selftest.mjs`);
  }
}

console.log(
  ok ? '\nSelf-test passed: every guard caught its planted defect.' : '\nSelf-test FAILED.',
);
process.exit(ok ? 0 : 1);
