import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '../support/step.js';

/** Checkout complete: the order confirmation. */
export class CheckoutCompletePage extends BasePage {
  readonly confirmation: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmation = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.confirmation).toHaveText('Thank you for your order!');
  }

  @step()
  async backHome() {
    await this.backHomeButton.click();
  }
}
