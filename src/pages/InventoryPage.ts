import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/** SauceDemo inventory / products page. */
export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
  }

  async goto() {
    await super.goto('/inventory.html');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  addToCart(productId: string) {
    return this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async badgeCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return parseInt(await this.cartBadge.innerText(), 10);
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(value);
  }

  async prices(): Promise<number[]> {
    const raw = await this.page.locator('.inventory_item_price').allTextContents();
    return raw.map((p) => parseFloat(p.replace('$', '')));
  }
}
