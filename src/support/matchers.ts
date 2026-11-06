import { expect as base } from '@playwright/test';
import { toCents } from './money.js';

export type SortOrder = 'asc' | 'desc';

/**
 * Custom matchers. Use them through `expect` from `src/fixtures/test.ts`.
 *
 *   await expect.poll(() => inventoryPage.prices.allTextContents()).toBeSortedByPrice('asc');
 *   expect(names).toBeSortedAlphabetically('desc');
 */
export const expect = base.extend({
  toBeSortedByPrice(received: string[], order: SortOrder) {
    return sorted(this, 'toBeSortedByPrice', received, order, (a, b) => toCents(a) - toCents(b));
  },
  toBeSortedAlphabetically(received: string[], order: SortOrder) {
    return sorted(this, 'toBeSortedAlphabetically', received, order, (a, b) => a.localeCompare(b));
  },
});

function sorted(
  ctx: { isNot: boolean; utils: { printReceived(v: unknown): string } },
  name: string,
  received: string[],
  order: SortOrder,
  compare: (a: string, b: string) => number,
) {
  // An empty or one-item list is trivially sorted, so it can't prove anything: fail it.
  const enough = received.length > 1;
  const ordered = [...received].sort((a, b) => (order === 'asc' ? compare(a, b) : compare(b, a)));
  const pass = enough && received.every((value, i) => value === ordered[i]);
  return {
    pass,
    name,
    message: () =>
      !enough
        ? `${name}: needs at least 2 values to prove an order, got ${ctx.utils.printReceived(received)}`
        : `expected ${ctx.utils.printReceived(received)} ${ctx.isNot ? 'not ' : ''}to be sorted ${order}` +
          (pass ? '' : `\nexpected order: ${ctx.utils.printReceived(ordered)}`),
  };
}
