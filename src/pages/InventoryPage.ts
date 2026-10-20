import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/** SauceDemo inventory / products page. */
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
    this.prices = page.locator('.inventory_item_price');
  }

  async goto() {
    await super.goto('/inventory.html');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  addToCart(productId: string) {
    return this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(value);
  }
}
