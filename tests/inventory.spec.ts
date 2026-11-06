import { test, expect } from '../src/fixtures/test.js';
import { PRODUCTS } from '../src/data/products.js';
import type { SortOption } from '../src/pages/InventoryPage.js';
import type { SortOrder } from '../src/support/matchers.js';

// These tests reuse the authenticated session from auth.setup.ts (via the project's storageState).
test.describe('Inventory', { annotation: { type: 'feature', description: 'Catalog' } }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();
  });

  test('shows the whole catalog', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(Object.keys(PRODUCTS).length);
    const shown = await inventoryPage.names.allTextContents();
    expect(new Set(shown)).toEqual(new Set(Object.values(PRODUCTS).map((p) => p.name)));
  });

  test('every product has its own image', async ({ inventoryPage }) => {
    await expect(inventoryPage.images).toHaveCount(Object.keys(PRODUCTS).length);
    const sources = await inventoryPage.images.evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('src')),
    );
    expect(new Set(sources).size).toBe(sources.length);
  });

  test('adding and removing items updates the cart badge', async ({ inventoryPage }) => {
    const { header } = inventoryPage;
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.onesie);
    await expect(header.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(PRODUCTS.backpack);
    await expect(header.cartBadge).toHaveText('1');
    await inventoryPage.removeFromCart(PRODUCTS.onesie);
    await expect(header.cartBadge).toBeHidden();
  });

  // One test per sort option, generated from data. Add a row to cover a new option.
  const NAME_SORTS: { option: SortOption; label: string; order: SortOrder }[] = [
    { option: 'az', label: 'name A to Z', order: 'asc' },
    { option: 'za', label: 'name Z to A', order: 'desc' },
  ];
  for (const { option, label, order } of NAME_SORTS) {
    test(`sorts by ${label}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      await expect
        .poll(() => inventoryPage.names.allTextContents())
        .toBeSortedAlphabetically(order);
    });
  }

  const PRICE_SORTS: { option: SortOption; label: string; order: SortOrder }[] = [
    { option: 'lohi', label: 'price low to high', order: 'asc' },
    { option: 'hilo', label: 'price high to low', order: 'desc' },
  ];
  for (const { option, label, order } of PRICE_SORTS) {
    test(`sorts by ${label}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      await expect.poll(() => inventoryPage.prices.allTextContents()).toBeSortedByPrice(order);
    });
  }
});
