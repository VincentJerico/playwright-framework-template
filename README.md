# Playwright Framework Template

[![CI](https://github.com/VincentJerico/playwright-framework-template/actions/workflows/ci.yml/badge.svg)](https://github.com/VincentJerico/playwright-framework-template/actions/workflows/ci.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

A **production-grade, reusable Playwright + TypeScript test framework** — the scaffolding I'd start a
real UI automation suite from, not just a bag of tests. It demonstrates the patterns that matter for
an SDET: custom fixtures, the Page Object Model, multi-environment config, one-time auth reuse,
data factories, cross-browser projects, tagging, linting, and CI.

> The demo target is [SauceDemo](https://www.saucedemo.com) so it runs out of the box. Point it at your
> own app by changing `src/config/env.ts` and the page objects.

## Why it's structured this way

| Pattern               | Where                                   | Why                                                                     |
| --------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| **Custom fixtures**   | `src/fixtures/test.ts`                  | Inject page objects into tests → specs stay declarative                 |
| **Page Object Model** | `src/pages/`                            | UI selectors live in one place; tests read like behavior                |
| **Multi-env config**  | `src/config/env.ts`                     | `TEST_ENV=dev\|staging\|prod` / `BASE_URL` — no hard-coded URLs         |
| **Auth reuse**        | `tests/auth.setup.ts` + `setup` project | Log in **once**, save storage state, reuse everywhere → faster, stabler |
| **Data factories**    | `src/data/factory.ts`                   | Faker-generated data → no shared/brittle fixtures                       |
| **Cross-browser**     | `playwright.config.ts` projects         | chromium · firefox · webkit · mobile-chrome                             |
| **Tagging**           | `@smoke` in titles                      | `npm run test:smoke` for a fast subset                                  |
| **Quality gates**     | ESLint · Prettier · CI                  | The framework holds itself to a standard                                |

## Getting started

```bash
npm install
npm run install:browsers      # Playwright browsers
npm test                      # all projects
npm run test:chromium         # single browser (fast local loop)
npm run test:smoke            # @smoke subset
npm run report                # open the HTML report
```

## Structure

```
playwright-framework-template/
├── playwright.config.ts        # projects, reporters, env-driven baseURL, auth reuse
├── src/
│   ├── config/env.ts           # environment + credentials resolution
│   ├── fixtures/test.ts        # custom test fixtures (page objects)
│   ├── pages/                  # BasePage · LoginPage · InventoryPage
│   └── data/factory.ts         # faker data factories
└── tests/
    ├── auth.setup.ts           # authenticate once → storage state
    ├── login.spec.ts           # logged-out flows (opts out of stored session)
    ├── inventory.spec.ts       # authenticated flows (reuse session)
    └── api.spec.ts             # request-fixture API example
```

## Extending it

1. Add a page object in `src/pages/` (extend `BasePage`).
2. Expose it as a fixture in `src/fixtures/test.ts`.
3. Write specs against the fixture; tag critical ones `@smoke`.
4. Add data builders to `src/data/factory.ts` as needed.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint + format, then the suite across
**chromium/firefox/webkit** in a matrix, uploading the HTML report per browser.
