import { test, expect } from '../src/fixtures/test.js';
import { config } from '../src/config/env.js';

// Login tests must start logged OUT — opt out of the project's stored session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid login lands on the inventory page @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(config.username, config.password);
    await inventoryPage.expectLoaded();
  });

  test('locked-out user is blocked', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', config.password);
    await loginPage.expectError('locked out');
  });

  test('invalid credentials show a generic error (no user enumeration)', async ({ loginPage }) => {
    await loginPage.login(config.username, 'wrong-password');
    await loginPage.expectError('do not match');
  });

  test('username is required', async ({ loginPage }) => {
    await loginPage.login('', config.password);
    await loginPage.expectError('Username is required');
  });

  test('password field is masked', async ({ loginPage }) => {
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });
});
