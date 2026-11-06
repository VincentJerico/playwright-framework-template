/**
 * The demo catalog: display name and the id the app stores in `localStorage["cart-contents"]`.
 * Prices are not listed on purpose: tests read them from the page, so a price change can't make a
 * test pass against a stale copy.
 */
export const PRODUCTS = {
  backpack: { id: 4, name: 'Sauce Labs Backpack' },
  bikeLight: { id: 0, name: 'Sauce Labs Bike Light' },
  boltTShirt: { id: 1, name: 'Sauce Labs Bolt T-Shirt' },
  fleeceJacket: { id: 5, name: 'Sauce Labs Fleece Jacket' },
  onesie: { id: 2, name: 'Sauce Labs Onesie' },
  redTShirt: { id: 3, name: 'Test.allTheThings() T-Shirt (Red)' },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
export type Product = (typeof PRODUCTS)[ProductKey];
