import { test, expect } from '../src/fixtures/test.js';

/**
 * API-level example using Playwright's `request` fixture — no browser needed.
 * Shows the framework also covers HTTP checks (extend with a typed API client as needed).
 */
test.describe('API', () => {
  test('the site under test responds 200 @smoke', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/html');
    expect(await res.text()).toContain('<title>Swag Labs</title>');
  });
});
