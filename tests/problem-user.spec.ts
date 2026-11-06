import { test, expect } from '../src/fixtures/test.js';
import { PRODUCTS } from '../src/data/products.js';
import { makeCustomer } from '../src/data/factory.js';

/**
 * Known defects, pinned. The demo's problem_user has bugs on purpose. Each test asserts the current
 * wrong behavior and names the issue, so it turns red the day the bug is fixed (or changes) and
 * someone has to update it. The repo bans test.fail(), which would also hide unrelated failures.
 */
test.use({ persona: 'problem' });

test.describe('problem_user (known defects)', { tag: '@known-defect' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();
  });

  test(
    'every product shows the same image',
    { annotation: { type: 'issue', description: 'Product images are all the same picture' } },
    async ({ inventoryPage }) => {
      await expect(inventoryPage.images).toHaveCount(Object.keys(PRODUCTS).length);
      const sources = await inventoryPage.images.evaluateAll((imgs) =>
        imgs.map((img) => img.getAttribute('src')),
      );
      expect(new Set(sources).size).toBe(1);
    },
  );

  test(
    'sorting by price changes nothing',
    { annotation: { type: 'issue', description: 'Sort dropdown does not reorder products' } },
    async ({ inventoryPage }) => {
      const before = await inventoryPage.prices.allTextContents();
      await inventoryPage.sortBy('lohi');
      await expect(inventoryPage.prices).toHaveText(before);
      expect(before).not.toBeSortedByPrice('asc');
    },
  );

  test(
    'typing a last name overwrites the first name',
    { annotation: { type: 'issue', description: 'Last Name input writes into First Name' } },
    async ({ app, checkoutInfoPage }) => {
      // Open the form directly: this test is about the Last Name field. For problem_user the cart's
      // Checkout button sometimes ignores the click (seen twice in CI, in Firefox and WebKit; never
      // for standard_user), which would make this test fail for an unrelated reason.
      await app.seedCart(PRODUCTS.backpack);
      await checkoutInfoPage.goto();
      await checkoutInfoPage.expectLoaded();

      const customer = makeCustomer();
      await checkoutInfoPage.enterCustomer({
        firstName: customer.firstName,
        lastName: customer.lastName,
      });
      await expect(checkoutInfoPage.firstName).toHaveValue(customer.lastName);
      await expect(checkoutInfoPage.lastName).toHaveValue('');
    },
  );
});
