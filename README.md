# Playwright Framework Template

[![CI](https://github.com/VincentJerico/playwright-framework-template/actions/workflows/ci.yml/badge.svg)](https://github.com/VincentJerico/playwright-framework-template/actions/workflows/ci.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

A reusable Playwright and TypeScript test framework. It's the structure I'd start a real UI
automation suite from: page objects and components, typed fixtures, state seeding, user personas,
custom matchers, step-level reporting, data factories, cross-browser projects, tags, and CI with a
self-test that proves the framework's own checks can fail.

It covers the demo's whole purchase journey (login, catalog, cart, checkout) in **26 tests per
browser project**, runs them on Chromium, Firefox, WebKit and mobile Chrome, and adds 2 HTTP-level
checks: 107 tests in total. Three of them pin known defects in the demo's `problem_user`.

> The demo target is [SauceDemo](https://www.saucedemo.com) so it runs out of the box. Point it at your
> own app by changing `src/config/env.ts` and the page objects.

## How it's organized

| Pattern               | Where                                   | Why                                                                          |
| --------------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| Page objects          | `src/pages/`                            | One class per page; selectors live in one place and tests read like behavior |
| Components            | `src/pages/components/Header.ts`        | The header and menu are shared by every page, so they're written once        |
| Custom fixtures       | `src/fixtures/test.ts`                  | Page objects arrive as fixtures, so specs stay short                         |
| State seeding         | `app.seedCart()` in the fixtures        | Arrange state directly; only the journey test clicks through every screen    |
| Personas              | `test.use({ persona: 'problem' })`      | Run a file as another user without a login step or extra setup project       |
| Step reporting        | `@step()` in `src/support/step.ts`      | Reports read "Add Sauce Labs Backpack to the cart", not a list of clicks     |
| Custom matchers       | `src/support/matchers.ts`               | `toBeSortedByPrice`, `toBeSortedAlphabetically`, with clear failure messages |
| Money in cents        | `src/support/money.ts`                  | Totals are checked to the cent; floating point can't hide an error           |
| Data-driven tests     | sort options, checkout validation       | A typed table generates one test per row                                     |
| Known defects, pinned | `tests/problem-user.spec.ts`            | Asserts today's bug and names it; turns red when the bug is fixed            |
| Multi-env config      | `src/config/env.ts`                     | `TEST_ENV=dev\|staging\|prod` or `BASE_URL`, no hard-coded URLs              |
| Auth reuse            | `tests/auth.setup.ts` + `setup` project | Log in once, save the session, reuse it in every spec                        |
| Cross-browser         | `playwright.config.ts` projects         | Chromium, Firefox, WebKit and mobile Chrome                                  |
| Tags + annotations    | `tag` / `annotation` test options       | `@smoke`, `@e2e`, `@known-defect`; features and issues show in the report    |
| Self-test             | `selftest/` + `npm run selftest`        | Each guard must catch a planted defect, or CI fails                          |
| Quality gates         | ESLint, Prettier, typecheck, CI         | Lint, format and type errors fail the build                                  |

How the layers fit together, and why each decision was made: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
How to write a test here: [CONTRIBUTING.md](CONTRIBUTING.md).

## Start your own project from it

1. Click **Use this template** on GitHub (or clone the repo).
2. Point it at your app:

   ```bash
   npm install
   npm run setup -- --name acme-e2e --dev https://dev.acme.test --staging https://staging.acme.test --prod https://acme.test
   ```

   This renames the package, writes your URLs into `src/config/env.ts` (staging and prod default to
   the dev URL), and creates `.env`. It's safe to run again.

3. Set `SAUCE_USERNAME` and `SAUCE_PASSWORD` in `.env` and as repository secrets. The run stops
   until they're set, because your app isn't the demo.
4. Replace the demo page objects and specs with your app's. Keep `src/support/`, the fixtures
   pattern and `selftest/`. The CI pipeline works as is.

CI checks this path on every push: the `Template setup` job sets up a fresh copy and makes sure it
still builds.

## What a test looks like

```ts
test('removing an item takes it out of the cart', async ({ app, cartPage }) => {
  await app.seedCart(PRODUCTS.backpack, PRODUCTS.bikeLight); // arrange through state
  await cartPage.goto();

  await cartPage.remove(PRODUCTS.backpack); // act through the UI, reported as a step
  await expect(cartPage.names).toHaveText([PRODUCTS.bikeLight.name]);
  await expect(cartPage.header.cartBadge).toHaveText('1');
});
```

## Getting started

```bash
npm install
npm run install:browsers      # Playwright browsers
npm test                      # all projects
npm run test:chromium         # single browser (fast local loop)
npm run test:smoke            # @smoke subset
npm run test:known-defects    # the pinned problem_user bugs
npm run selftest              # prove the guards still catch planted defects
npm run report                # open the HTML report
```

### Configuration

Copy `.env.example` to `.env` to set `TEST_ENV`, `BASE_URL`, or credentials; shell variables win over
`.env`. Credentials fall back to SauceDemo's public demo user (`standard_user` / `secret_sauce`) only
while the target is SauceDemo. Point `BASE_URL` or an environment at your own app and the run stops at
startup until `SAUCE_USERNAME` and `SAUCE_PASSWORD` are set, in CI as well as locally.

## Structure

```
playwright-framework-template/
├── playwright.config.ts        # projects, reporters, env-driven baseURL, auth reuse, testIdAttribute
├── src/
│   ├── config/                 # env.ts (environment + credentials) · users.ts (personas)
│   ├── fixtures/test.ts        # page fixtures, persona option, app state seeding
│   ├── pages/                  # BasePage · Login · Inventory · Cart · Checkout info/overview/complete
│   │   └── components/         # Header (cart link, menu, logout, reset)
│   ├── support/                # @step decorator · custom matchers · money in cents
│   └── data/                   # factories (credentials, customers) · product catalog
├── tests/
│   ├── auth.setup.ts           # authenticate once → storage state
│   ├── login.spec.ts           # logged-out flows, logout
│   ├── inventory.spec.ts       # catalog, images, cart badge, 4 sort orders
│   ├── cart.spec.ts            # cart contents, remove, reload, reset app state
│   ├── checkout.spec.ts        # end-to-end purchase, totals, required fields, cancel
│   ├── problem-user.spec.ts    # known defects, pinned
│   └── api.spec.ts             # `api` project: HTTP checks, no browser or login
├── selftest/                   # planted failures (never part of the main suite)
├── scripts/selftest.mjs        # passes only if every planted failure fails for its reason
└── docs/ARCHITECTURE.md
```

## Known defects found

The demo's `problem_user` has deliberate bugs. These tests assert them as they are today:

| Defect                                        | Test                                           |
| --------------------------------------------- | ---------------------------------------------- |
| Every product shows the same image            | `every product shows the same image`           |
| Sorting by price doesn't reorder the products | `sorting by price changes nothing`             |
| Typing a last name overwrites the first name  | `typing a last name overwrites the first name` |

Also observed, not pinned: for `problem_user`, the cart's **Checkout** button sometimes ignores a
click. It happened twice in CI (once in Firefox, once in WebKit) and never for `standard_user`, whose
checkout tests make the same click. An intermittent bug can't be pinned with an assertion, so the
last-name test opens the checkout form directly instead.

## Extending it

1. Add a page object in `src/pages/` (extend `BasePage`, give actions `@step()`).
2. Expose it as a fixture in `src/fixtures/test.ts`.
3. Write specs against the fixture; arrange state with `app`; tag critical ones `@smoke`.
4. Add data builders to `src/data/factory.ts` as needed.
5. A new matcher or guard gets a planted failure in `selftest/`.

## CI and automation

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request, on
`main`, and every night at 03:00 Philippine time (19:00 UTC), so a change on the site under test shows
up even when this repo hasn't changed:

1. **Lint, format and typecheck.** Everything else waits for these.
2. **Self-test.** Each guard must catch its planted defect. **Template setup** checks that a fresh
   copy can be set up and still builds.
3. **API.** HTTP checks without a browser.
4. **Smoke.** The `@smoke` tests on Chromium, so a broken build fails in about a minute.
5. **E2E.** The full suite on Chromium, Firefox, WebKit and mobile Chrome, each split across 2
   shards. Every shard's results are merged into **one HTML report** (artifact `playwright-report`),
   and a results table per browser is written to the run's summary page.
6. **E2E result.** A single pass/fail check for branch protection, whatever the browser and shard
   matrix becomes.
7. **Publish report** (`main` and nightly only). The merged report goes to GitHub Pages:
   https://vincentjerico.github.io/playwright-framework-template/

CI retries a failed test twice so the report captures a trace, but `failOnFlakyTests` still fails the
run when a retry passes, so flakiness gets fixed instead of hidden. A new push to a pull request
cancels its older run. Run it by hand from the Actions tab, optionally with a `grep` such as `@smoke`.

### Use the pipeline from another repo

The E2E stage is a reusable workflow,
[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). Any repo with a Playwright
config can call it:

```yaml
jobs:
  e2e:
    uses: VincentJerico/playwright-framework-template/.github/workflows/playwright.yml@main
    with:
      projects: '["chromium"]' # JSON array of your Playwright project names
      shards: 2
      grep: '' # e.g. '@smoke'
      working-directory: . # where package.json and playwright.config.ts live
    secrets: inherit
```

It installs dependencies and browsers, runs each project across the shards, merges the results into
one `playwright-report` artifact, and writes the summary. If your config has a `webServer`, Playwright
starts your app in each job.
