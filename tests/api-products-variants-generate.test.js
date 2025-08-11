const handler = require('../pages/api/products/variants/generate.js');

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
    end() { return this; },
  };
}

describe('POST /api/products/variants/generate', () => {
  test('generates variants from axes', async () => {
    const req = {
      method: 'POST',
      body: {
        axes: [
          { code: 'color', label: 'Color', options: ['Red', 'Blue'] },
          { code: 'size', label: 'Size', options: ['S', 'M', 'L'] },
        ],
        baseSku: 'TS',
        baseName: 'Tee',
      },
    };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.count).toBe(6);
    expect(Array.isArray(res.body.variants)).toBe(true);
    expect(res.body.variants.length).toBe(6);
    const sample = res.body.variants[0];
    expect(sample.sku.startsWith('TS')).toBe(true);
    expect(sample).toHaveProperty('options');
    expect(Object.keys(sample.options)).toEqual(expect.arrayContaining(['color', 'size']));
  });

  test('rejects non-POST methods', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.headers['Allow']).toBe('POST');
    expect(res.body).toHaveProperty('error');
  });
});
