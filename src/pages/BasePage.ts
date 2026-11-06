import { type Locator, type Page } from '@playwright/test';
import { Header } from './components/Header.js';

/** Base class for all page objects: the Page, the shared header, and navigation. */
export abstract class BasePage {
  readonly header: Header;
  readonly title: Locator;

  constructor(protected readonly page: Page) {
    this.header = new Header(page);
    this.title = page.getByTestId('title');
  }

  /**
   * Navigate to a path relative to the configured baseURL. Waits for the DOM, not the `load` event:
   * `load` also waits for third-party fonts and scripts, which can stall it while the app is
   * already usable. Each page's `expectLoaded()` waits for the real content instead.
   */
  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}
