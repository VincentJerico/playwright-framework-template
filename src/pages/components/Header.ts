import { type Locator, type Page } from '@playwright/test';
import { step } from '../../support/step.js';

/** The header and side menu shared by every signed-in page. A component, not a page. */
export class Header {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly openMenu: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.openMenu = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
  }

  @step()
  async openCart() {
    await this.cartLink.click();
  }

  @step()
  async logout() {
    await this.openMenu.click();
    await this.logoutLink.click();
  }

  @step()
  async resetAppState() {
    await this.openMenu.click();
    await this.resetAppStateLink.click();
  }
}
