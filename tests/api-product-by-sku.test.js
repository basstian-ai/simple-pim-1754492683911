const handler = require('../lib/api/productBySkuHandler');
const products = require('../data/products.json');

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    _json: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key] = val;
    },
    json(payload) {
      this._json = payload;
      return this;
    },
  };
}

describe('API: GET /api/products/[sku]', () => {
  it('returns product by sku', async () => {
    const sample = Array.isArray(products) && products.find((p) => p && p.sku);
    expect(sample).toBeTruthy();
    const res = createRes();
    await handler({ method: 'GET', query: { sku: sample.sku } }, res);
    expect(res.statusCode).toBe(200);
    expect(res._json).toBeTruthy();
    expect(res._json.sku).toBe(sample.sku);
  });

  it('returns 404 for unknown sku', async () => {
    const res = createRes();
    await handler({ method: 'GET', query: { sku: '__missing__sku__' } }, res);
    expect(res.statusCode).toBe(404);
    expect(res._json && res._json.error).toBeTruthy();
  });

  it('rejects non-GET methods', async () => {
    const res = createRes();
    await handler({ method: 'POST', query: { sku: 'ANY' } }, res);
    expect(res.statusCode).toBe(405);
  });
});
