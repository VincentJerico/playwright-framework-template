import { test, expect } from '../src/fixtures/test.js';
import { PRODUCTS } from '../src/data/products.js';
import { makeCustomer, type Customer } from '../src/data/factory.js';
import { sumCents } from '../src/support/money.js';

test.describe('Checkout', { annotation: { type: 'feature', description: 'Checkout' } }, () => {
  test(
    'a customer can buy two items end to end',
    { tag: ['@smoke', '@e2e'] },
    async ({
      inventoryPage,
      cartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      await test.step('Pick two products', async () => {
        await inventoryPage.goto();
        await inventoryPage.addToCart(PRODUCTS.backpack);
        await inventoryPage.addToCart(PRODUCTS.bikeLight);
        await inventoryPage.header.openCart();
        await cartPage.expectLoaded();
        await cartPage.checkout();
      });

      await test.step('Enter customer details', async () => {
        await checkoutInfoPage.expectLoaded();
        await checkoutInfoPage.enterCustomer(makeCustomer());
        await checkoutInfoPage.continue();
      });

      await test.step('Check the order summary adds up', async () => {
        await checkoutOverviewPage.expectLoaded();
        await expect(checkoutOverviewPage.items).toHaveCount(2);
        const lineItems = sumCents(await checkoutOverviewPage.prices.allInnerTexts());
        const { subtotal, tax, total } = await checkoutOverviewPage.totalsInCents();
        expect(subtotal).toBe(lineItems);
        expect(tax).toBeGreaterThan(0);
        expect(total).toBe(subtotal + tax);
      });

      await test.step('Place the order', async () => {
        await checkoutOverviewPage.finish();
        await checkoutCompletePage.expectLoaded();
        await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
      });
    },
  );

  // Each required field, left out once. Data-driven: add a row to cover a new rule.
  const MISSING: { field: keyof Customer; error: string }[] = [
    { field: 'firstName', error: 'First Name is required' },
    { field: 'lastName', error: 'Last Name is required' },
    { field: 'postalCode', error: 'Postal Code is required' },
  ];
  for (const { field, error } of MISSING) {
    test(`asks for ${field} when it is missing`, async ({ app, cartPage, checkoutInfoPage }) => {
      await app.seedCart(PRODUCTS.onesie);
      await cartPage.goto();
      await cartPage.expectLoaded();
      await cartPage.checkout();
      await checkoutInfoPage.expectLoaded();

      await checkoutInfoPage.enterCustomer({ ...makeCustomer(), [field]: undefined });
      await checkoutInfoPage.continue();
      await expect(checkoutInfoPage.error).toContainText(error);
      await checkoutInfoPage.expectLoaded();
    });
  }

  test('cancelling the summary keeps the cart', async ({
    app,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    inventoryPage,
  }) => {
    await app.seedCart(PRODUCTS.backpack);
    await cartPage.goto();
    await cartPage.expectLoaded();
    await cartPage.checkout();
    await checkoutInfoPage.expectLoaded();
    await checkoutInfoPage.enterCustomer(makeCustomer());
    await checkoutInfoPage.continue();

    await checkoutOverviewPage.cancelButton.click();
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
  });
});
