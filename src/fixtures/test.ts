import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage.js';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage.js';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage.js';
import { USERS, type Persona } from '../config/users.js';
import type { Product } from '../data/products.js';

/** Third-party error telemetry the demo sends from every page. Add your app's own here. */
const TELEMETRY = /events\.backtrace\.io/;

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

type Options = {
  /**
   * Run the test signed in as another demo persona: `test.use({ persona: 'problem' })`.
   * Unset, the test uses the project's saved session (the standard user from auth.setup.ts).
   */
  persona: Persona | undefined;
};

type Fixtures = Pages & {
  /** Arrange application state directly instead of clicking through the UI. */
  app: AppState;
};

/**
 * Setting state without the UI keeps a test focused on the one thing it checks, and makes it
 * faster. SauceDemo keeps its session in a cookie and the cart in localStorage, so both can be
 * written directly. On a real app, call its API here instead (seed data, create the user).
 */
export class AppState {
  constructor(private readonly page: Page) {}

  /**
   * Puts these products in the cart on the test's next page load, without navigating now. An init
   * script writes the cart once per tab (a sessionStorage flag stops a reload from re-seeding it).
   * An extra navigation here used to overlap with the test's own and broke checkout in Firefox.
   */
  async seedCart(...products: Product[]) {
    await this.page.addInitScript(
      (ids) => {
        if (sessionStorage.getItem('seeded-cart')) return;
        localStorage.setItem('cart-contents', JSON.stringify(ids));
        sessionStorage.setItem('seeded-cart', '1');
      },
      products.map((p) => p.id),
    );
  }
}

export const test = base.extend<Options & Fixtures>({
  persona: [undefined, { option: true }],

  page: async ({ page, persona, baseURL }, use) => {
    // Tests shouldn't report fake errors to the site's telemetry, or wait on it being up.
    await page.context().route(TELEMETRY, (route) => route.abort());
    if (persona) {
      await page
        .context()
        .addCookies([{ name: 'session-username', value: USERS[persona], url: baseURL! }]);
    }
    await use(page);
  },

  app: async ({ page }, use) => use(new AppState(page)),

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInfoPage: async ({ page }, use) => use(new CheckoutInfoPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
});

export { expect } from '../support/matchers.js';
