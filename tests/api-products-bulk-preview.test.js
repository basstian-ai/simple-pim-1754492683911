const handler = require('../pages/api/products/tags/bulk-preview.js');
const sampleProducts = require('../lib/sampleProducts');

function createMockRes() {
  const headers = {};
  let statusCode = 200;
  let body;
  const res = {
    setHeader: (k, v) => { headers[k] = v; },
    status: (c) => { statusCode = c; return res; },
    json: (b) => { body = b; return res; },
  };
  Object.defineProperty(res, 'headers', { get: () => headers });
  Object.defineProperty(res, 'statusCode', { get: () => statusCode });
  Object.defineProperty(res, 'body', { get: () => body });
  return res;
}

describe('POST /api/products/tags/bulk-preview', () => {
  test('previews adding a tag for provided SKUs', async () => {
    const tag = '__bulk_tag__';
    const skus = sampleProducts.slice(0, 2).map((p) => p.sku);

    const req = { method: 'POST', body: { skus, add: [tag] } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.count).toBe(2);
    expect(res.body.stats.matched).toBe(2);
    expect(res.body.stats.added).toBeGreaterThan(0);
    for (const item of res.body.items) {
      expect(item.after).toEqual(expect.arrayContaining([tag]));
    }
  });

  test('rejects non-POST methods', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
  });

  test('requires at least one SKU', async () => {
    const req = { method: 'POST', body: { add: ['x'] } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Provide at least one SKU/);
  });
});
