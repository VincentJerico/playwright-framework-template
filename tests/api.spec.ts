import { test, expect } from '../src/fixtures/test.js';

/**
 * HTTP-level checks with Playwright's `request` fixture: no browser, no login. They run in the
 * `api` project and catch a broken deploy (missing bundle, wrong MIME type) in seconds.
 */
test.describe('API', { annotation: { type: 'feature', description: 'Delivery' } }, () => {
  test('the site under test responds 200', { tag: '@smoke' }, async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/html');
    expect(await res.text()).toContain('<title>Swag Labs</title>');
  });

  test('every script and stylesheet the home page needs is served', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const assets = [
      ...html.matchAll(/<(?:script[^>]+src|link[^>]+href)="(\/[^"]+\.(js|css))"/g),
    ].map(([, path, ext]) => ({ path, ext }));
    // A page that references nothing would pass trivially, so require the app bundle.
    expect(assets.map((a) => a.ext)).toContain('js');

    for (const { path, ext } of assets) {
      await test.step(`GET ${path}`, async () => {
        const res = await request.get(path);
        expect(res.status(), path).toBe(200);
        expect(res.headers()['content-type'], path).toContain(ext === 'js' ? 'javascript' : 'css');
      });
    }
  });
});
