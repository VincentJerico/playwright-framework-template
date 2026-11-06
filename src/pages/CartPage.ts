import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '../support/step.js';
import type { Product } from '../data/products.js';

/** SauceDemo cart page. */
export class CartPage extends BasePage {
  readonly items: Locator;
  readonly names: Locator;
  readonly prices: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.names = page.getByTestId('inventory-item-name');
    this.prices = page.getByTestId('inventory-item-price');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await super.goto('/cart.html');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.title).toHaveText('Your Cart');
  }

  @step('Remove {0.name} from the cart')
  async remove(product: Product) {
    await this.items
      .filter({ hasText: product.name })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  @step()
  async checkout() {
    await this.checkoutButton.click();
  }
}
