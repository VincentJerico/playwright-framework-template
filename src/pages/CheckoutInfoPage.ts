import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '../support/step.js';
import type { Customer } from '../data/factory.js';

/** Checkout step one: the customer's name and postal code. */
export class CheckoutInfoPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.error = page.getByTestId('error');
  }

  async goto() {
    await super.goto('/checkout-step-one.html');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  /** Fills only the fields given, so a test can leave one out on purpose. */
  @step()
  async enterCustomer(customer: Partial<Customer>) {
    if (customer.firstName !== undefined) await this.firstName.fill(customer.firstName);
    if (customer.lastName !== undefined) await this.lastName.fill(customer.lastName);
    if (customer.postalCode !== undefined) await this.postalCode.fill(customer.postalCode);
  }

  @step()
  async continue() {
    await this.continueButton.click();
  }
}
