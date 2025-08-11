const handler = require('../pages/api/tags/stats').default || require('../pages/api/tags/stats');

function createMocks({ method = 'GET', body } = {}) {
  const req = { method, body };
  const res = {
    statusCode: 0,
    _json: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this._json = payload;
      return this;
    },
  };
  return { req, res };
}

describe('API /api/tags/stats', () => {
  test('returns counts and top arrays', () => {
    const { req, res } = createMocks({ method: 'GET' });
    handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._json).toHaveProperty('counts');
    expect(typeof res._json.counts).toBe('object');
    expect(Array.isArray(res._json.top)).toBe(true);
    // Should have at least one tag in typical sample data
    expect(Object.keys(res._json.counts).length).toBeGreaterThan(0);
  });

  test('405 on non-GET', () => {
    const { req, res } = createMocks({ method: 'POST' });
    handler(req, res);
    expect(res.statusCode).toBe(405);
  });
});
