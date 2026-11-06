import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '../support/step.js';
import type { Product } from '../data/products.js';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/** SauceDemo inventory / products page. */
export class InventoryPage extends BasePage {
  readonly items: Locator;
  readonly names: Locator;
  readonly prices: Locator;
  readonly images: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.names = page.getByTestId('inventory-item-name');
    this.prices = page.getByTestId('inventory-item-price');
    this.images = this.items.getByRole('img');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async goto() {
    await super.goto('/inventory.html');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  /** The card for one product, found by its visible name. */
  item(product: Product): Locator {
    return this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(product.name, { exact: true }),
    });
  }

  @step('Add {0.name} to the cart')
  async addToCart(product: Product) {
    await this.item(product).getByRole('button', { name: 'Add to cart' }).click();
  }

  @step('Remove {0.name} from the cart')
  async removeFromCart(product: Product) {
    await this.item(product).getByRole('button', { name: 'Remove' }).click();
  }

  @step('Sort by {0}')
  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }
}
