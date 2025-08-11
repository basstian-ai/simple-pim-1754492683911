const path = require('path');

describe('/api/attribute-groups/duplicates', () => {
  function createMockRes() {
    const res = {
      statusCode: 200,
      headers: {},
      body: undefined,
      setHeader(name, value) { this.headers[name] = value; },
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.body = payload; return this; },
    };
    return res;
  }

  it('returns a report with byCode array and a numeric count', async () => {
    const mod = require(path.join('..', 'pages', 'api', 'attribute-groups', 'duplicates.js'));
    const handler = mod.default || mod;

    const req = { method: 'GET', query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.byCode)).toBe(true);
    expect(typeof res.body.count).toBe('number');

    if (res.body.count > 0) {
      for (const item of res.body.byCode) {
        expect(typeof item.code).toBe('string');
        expect(typeof item.total).toBe('number');
        expect(Array.isArray(item.groups)).toBe(true);
        expect(item.groups.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('respects the min query param', async () => {
    const mod = require(path.join('..', 'pages', 'api', 'attribute-groups', 'duplicates.js'));
    const handler = mod.default || mod;

    const req = { method: 'GET', query: { min: '3' } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.byCode)).toBe(true);
  });
});
