import { type Page } from '@playwright/test';

/** Base class for all page objects — holds the Page and common helpers. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path relative to the configured baseURL. */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  async title(): Promise<string> {
    return this.page.title();
  }
}
