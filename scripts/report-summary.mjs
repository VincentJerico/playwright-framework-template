// Markdown summary of a Playwright JSON report, for the GitHub Actions run page.
//
//   node scripts/report-summary.mjs results.json "full suite" >> "$GITHUB_STEP_SUMMARY"
import { readFileSync } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';

const [file, label = 'Playwright'] = process.argv.slice(2);
const report = JSON.parse(readFileSync(file, 'utf8'));

// One row per test per project. Outcome is Playwright's: expected, unexpected, flaky, skipped.
const rows = [];
const walk = (suite, path) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      rows.push({
        project: t.projectName || '(default)',
        title: [...path, spec.title].join(' › '),
        file: spec.file,
        outcome: t.status,
        error: stripVTControlCharacters(t.results.at(-1)?.error?.message ?? '').split('\n')[0],
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child, suite.title ? [...path, suite.title] : path);
};
for (const suite of report.suites) walk(suite, []);

const projects = [...new Set(rows.map((r) => r.project))].sort();
const count = (project, outcome) =>
  rows.filter((r) => r.project === project && r.outcome === outcome).length;
const { expected, unexpected, flaky, skipped, duration } = report.stats;
const status = unexpected > 0 ? 'FAILED' : flaky > 0 ? 'FLAKY' : 'PASSED';

const out = [
  `## Playwright: ${label}, ${status}`,
  '',
  `${expected} passed, ${unexpected} failed, ${flaky} flaky, ${skipped} skipped in ${(duration / 1000).toFixed(1)} s`,
  '',
  '| Project | Passed | Failed | Flaky | Skipped |',
  '| --- | --: | --: | --: | --: |',
  ...projects.map(
    (p) =>
      `| ${p} | ${count(p, 'expected')} | ${count(p, 'unexpected')} | ${count(p, 'flaky')} | ${count(p, 'skipped')} |`,
  ),
];

const strip = (s) => s.replace(/\|/g, '\\|');
for (const [outcome, heading] of [
  ['unexpected', 'Failed'],
  ['flaky', 'Flaky (passed on retry; CI still fails the run)'],
]) {
  const list = rows.filter((r) => r.outcome === outcome);
  if (list.length === 0) continue;
  out.push('', `### ${heading}`, '', '| Project | Test | Error |', '| --- | --- | --- |');
  for (const r of list) out.push(`| ${r.project} | ${strip(r.title)} | ${strip(r.error)} |`);
}

out.push('', 'Full report with traces: the `playwright-report` artifact of this run.');
console.log(out.join('\n'));
