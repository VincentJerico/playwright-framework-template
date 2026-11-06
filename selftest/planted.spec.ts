import { test, expect } from '../src/fixtures/test.js';
import { toCents } from '../src/support/money.js';

/**
 * Planted failures. Every test here MUST fail; scripts/selftest.mjs checks that each one does, for
 * the reason in its title. If a guard stops catching what it should (a matcher that always passes,
 * a page assertion that checks nothing), its test passes here and the self-test fails CI.
 *
 * Never run these with the main suite: playwright.config.ts doesn't include this folder.
 */

test('[sorted-by-price] rejects an unsorted price list', () => {
  expect(['$29.99', '$9.99', '$15.99']).toBeSortedByPrice('asc');
});

test('[sorted-needs-two] rejects a list too short to prove an order', () => {
  expect(['$9.99']).toBeSortedByPrice('asc');
});

test('[sorted-alpha] rejects names in the wrong direction', () => {
  expect(['Backpack', 'Onesie']).toBeSortedAlphabetically('desc');
});

test('[money-parse] refuses a label with no dollar amount', () => {
  toCents('Total: free');
});

test('[page-assertion] a page object assertion fails on the wrong page', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.expectError('this message is never shown');
});
