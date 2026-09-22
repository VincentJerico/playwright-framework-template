import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage.js';
import { config, STORAGE_STATE } from '../src/config/env.js';
import { mkdirSync } from 'node:fs';

/**
 * Global authentication — runs once before the browser projects and saves the session to
 * STORAGE_STATE, so authenticated specs skip logging in through the UI every time (faster + stabler).
 */
setup('authenticate', async ({ page }) => {
  mkdirSync('playwright/.auth', { recursive: true });

  const login = new LoginPage(page);
  await login.goto();
  await login.login(config.username, config.password);
  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: STORAGE_STATE });
});
