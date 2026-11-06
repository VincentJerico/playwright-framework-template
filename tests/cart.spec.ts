import { test, expect } from '../src/fixtures/test.js';
import { PRODUCTS } from '../src/data/products.js';

test.describe('Cart', { annotation: { type: 'feature', description: 'Cart' } }, () => {
  test('shows what was added on the products page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.boltTShirt);
    await inventoryPage.header.openCart();

    await cartPage.expectLoaded();
    await expect(cartPage.names).toHaveText([PRODUCTS.backpack.name, PRODUCTS.boltTShirt.name]);
  });

  // The cart is arranged through app state, not the UI, so this test is only about removing.
  test('removing an item takes it out of the cart', async ({ app, cartPage }) => {
    await app.seedCart(PRODUCTS.backpack, PRODUCTS.bikeLight);
    await cartPage.goto();
    await expect(cartPage.items).toHaveCount(2);

    await cartPage.remove(PRODUCTS.backpack);
    await expect(cartPage.names).toHaveText([PRODUCTS.bikeLight.name]);
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });

  test('the cart survives a reload', async ({ app, cartPage, page }) => {
    await app.seedCart(PRODUCTS.fleeceJacket);
    await cartPage.goto();
    await page.reload();
    await expect(cartPage.names).toHaveText([PRODUCTS.fleeceJacket.name]);
  });

  test('continue shopping returns to the products page', async ({ cartPage, inventoryPage }) => {
    await cartPage.goto();
    await cartPage.continueShoppingButton.click();
    await inventoryPage.expectLoaded();
  });

  test('reset app state empties the cart', async ({ app, inventoryPage }) => {
    await app.seedCart(PRODUCTS.onesie, PRODUCTS.redTShirt);
    await inventoryPage.goto();
    await expect(inventoryPage.header.cartBadge).toHaveText('2');

    await inventoryPage.header.resetAppState();
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });
});
