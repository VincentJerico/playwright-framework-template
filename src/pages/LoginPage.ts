import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { step } from '../support/step.js';

/** SauceDemo login page. */
export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
  }

  async goto() {
    await super.goto('/');
  }

  @step('Log in as {0}')
  async login(username: string, password: string) {
    if (username) await this.username.fill(username);
    if (password) await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectError(message: string) {
    await expect(this.error).toContainText(message);
  }
}
