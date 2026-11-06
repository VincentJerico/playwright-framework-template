import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '../support/step.js';
import { toCents } from '../support/money.js';

/** Checkout step two: the order summary with item total, tax and total. */
export class CheckoutOverviewPage extends BasePage {
  readonly items: Locator;
  readonly prices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.prices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  /** The three summary amounts in cents, read from the page. */
  async totalsInCents() {
    return {
      subtotal: toCents(await this.subtotal.innerText()),
      tax: toCents(await this.tax.innerText()),
      total: toCents(await this.total.innerText()),
    };
  }

  @step()
  async finish() {
    await this.finishButton.click();
  }
}
