# Contributing

## Before you push

```bash
npm run lint && npm run format:check && npm run typecheck
npx playwright test --project=setup --project=chromium   # fast local loop
npm run selftest                                          # the guards still bite
```

## Writing a test

- **One behavior per test**, named as a sentence about the app: `the cart survives a reload`, not
  `test cart 2`.
- **No selectors in specs.** Add them to the page object. Prefer `getByTestId` and `getByRole`;
  never CSS chains or XPath.
- **Arrange through `app`, act through the UI.** Only an end-to-end journey clicks through every
  screen.
- **Every action in a page object gets `@step()`** (or `@step('Title with {0.name}')`).
- **Assert with web-first matchers** (`toHaveText`, `toHaveCount`, `expect.poll`). No
  `waitForTimeout`.
- **Data from factories** (`makeCustomer()`), products from `PRODUCTS`. Never type a price: read it
  from the page.
- **Data-driven cases** use a typed table and a `for` loop, one test per row.

## Tags and annotations

| Tag             | Meaning                                           | Run it                            |
| --------------- | ------------------------------------------------- | --------------------------------- |
| `@smoke`        | The few checks that say "the app basically works" | `npm run test:smoke`              |
| `@e2e`          | A full user journey across screens                | `npx playwright test --grep @e2e` |
| `@known-defect` | Pins a known bug; turns red when it's fixed       | `npm run test:known-defects`      |

Tag with the `tag` option, not in the title: `test('...', { tag: '@smoke' }, async () => {})`.
Group a file under a feature with `{ annotation: { type: 'feature', description: 'Checkout' } }`, and
mark a known defect with `{ type: 'issue', description: '...' }`. Both show in the HTML report.

## Known defects

Don't skip or `test.fail()` a test for a known bug. Assert the current wrong behavior, add an `issue`
annotation, and tag the test `@known-defect`. When the bug is fixed the test fails; then rewrite it to
assert the right behavior.

## Adding a guard

A new custom matcher or helper that can reject bad input needs a planted failure in
`selftest/planted.spec.ts` and an entry in `scripts/selftest.mjs` saying what its failure message
must contain.

## Commits and PRs

Conventional commit prefixes (`feat:`, `fix:`, `test:`, `docs:`, `ci:`, `chore:`). Every change goes
through a branch and a pull request, and CI must be green.
