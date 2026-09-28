import { test, expect } from '../src/fixtures/test.js';
import { config } from '../src/config/env.js';
import { makeRandomCredentials } from '../src/data/factory.js';

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
    const wrongPasswordError = await loginPage.error.innerText();

    // Reload so the next assertion can't match the previous attempt's message.
    await loginPage.goto();
    const unknownUser = makeRandomCredentials();
    await loginPage.login(unknownUser.username, unknownUser.password);
    await expect(loginPage.error).toHaveText(wrongPasswordError);
  });

  test('username is required', async ({ loginPage }) => {
    await loginPage.login('', config.password);
    await loginPage.expectError('Username is required');
  });

  test('password field is masked', async ({ loginPage }) => {
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });
});
