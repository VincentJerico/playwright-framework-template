import { test, expect } from '../src/fixtures/test.js';

// These tests reuse the authenticated session from auth.setup.ts (via the project's storageState).
test.describe('Inventory (authenticated)', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();
  });

  test('shows all products @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('adding an item updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('sorts products by price low to high', async ({ inventoryPage }) => {
    // An empty or single-item list is trivially sorted, so require something to reorder.
    await expect.poll(() => inventoryPage.prices.count()).toBeGreaterThan(1);
    const shown = await inventoryPage.prices.allTextContents();
    const ascending = [...shown].sort((a, b) => dollars(a) - dollars(b));

    await inventoryPage.sortBy('lohi');
    await expect(inventoryPage.prices).toHaveText(ascending);
  });
});

function dollars(price: string): number {
  return parseFloat(price.replace('$', ''));
}
