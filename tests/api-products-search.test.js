const handler = require('../pages/api/products/search.js');
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

describe('GET /api/products/search', () => {
  test('returns items matching a name/sku query', async () => {
    const p = sampleProducts[0];
    const q = p.name.split(' ')[0];

    const req = { method: 'GET', query: { q } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    // At least one item should contain the query in name/sku/slug
    const anyMatch = res.body.items.some((it) =>
      [it.name, it.sku, it.slug].some((f) => typeof f === 'string' && f.toLowerCase().includes(q.toLowerCase()))
    );
    expect(anyMatch).toBe(true);
  });

  test('filters by tags and supports pagination', async () => {
    const p = sampleProducts.find((sp) => Array.isArray(sp.tags) && sp.tags.length > 0) || sampleProducts[0];
    const tag = (p.tags && p.tags[0]) || '';

    const req = { method: 'GET', query: { tags: tag, limit: '1', offset: '0' } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(typeof res.body.count).toBe('number');
    expect(res.body.limit).toBe(1);
    expect(res.body.offset).toBe(0);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(1);
    // All returned items should include the tag (if a tag was provided)
    if (tag) {
      for (const it of res.body.items) {
        expect(Array.isArray(it.tags)).toBe(true);
        expect(it.tags).toEqual(expect.arrayContaining([tag]));
      }
    }
  });

  test('rejects non-GET methods', async () => {
    const req = { method: 'POST', body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('GET');
  });
});
