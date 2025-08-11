import handler from '../pages/api/products/[sku]/attributes/flat';
const sampleProducts = require('../lib/sampleProducts');

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('GET /api/products/[sku]/attributes/flat', () => {
  it('returns flattened attributes for an existing product', async () => {
    const first = sampleProducts[0];
    expect(first).toBeDefined();
    const req = { method: 'GET', query: { sku: first.sku } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.sku).toBe(first.sku);
    expect(Array.isArray(res.body.attributes)).toBe(true);
    expect(res.body.count).toBe(res.body.attributes.length);
    if (res.body.attributes.length > 0) {
      const entry = res.body.attributes[0];
      expect(entry).toHaveProperty('groupName');
      expect(entry).toHaveProperty('code');
    }
  });

  it('returns 404 for unknown sku', async () => {
    const req = { method: 'GET', query: { sku: 'UNKNOWN-SKU-XYZ' } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
