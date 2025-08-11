const handler = require('../pages/api/attribute-groups/validate.js');

function createMockReqRes(method = 'POST', body = null) {
  const req = { method, body };
  const res = {
    _status: 200,
    _headers: {},
    _json: undefined,
    setHeader(k, v) { this._headers[k] = v; },
    status(code) { this._status = code; return this; },
    json(obj) { this._json = obj; return this; },
  };
  return { req, res };
}

describe('API /api/attribute-groups/validate', () => {
  test('returns 200 and valid=true for a correct payload', async () => {
    const good = {
      groups: [
        { name: 'General', description: 'Common data', attributes: [ { code: 'color', type: 'text' }, { code: 'size', type: 'select', options: ['S','M','L'] } ] },
      ],
    };
    const { req, res } = createMockReqRes('POST', good);
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._json).toBeDefined();
    expect(res._json.valid).toBe(true);
    expect(res._json.count).toBe(1);
  });

  test('returns 400 and errors for invalid payload (missing group name, duplicate attribute code)', async () => {
    const bad = {
      groups: [
        { description: 'no name here', attributes: [ { code: 'a', type: 'text' }, { code: 'a', type: 'text' } ] },
      ],
    };
    const { req, res } = createMockReqRes('POST', bad);
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._json).toBeDefined();
    expect(res._json.valid).toBe(false);
    expect(Array.isArray(res._json.errors)).toBe(true);
    expect(res._json.errors.length).toBeGreaterThan(0);
  });

  test('returns 405 for non-POST', async () => {
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);
    expect(res._status).toBe(405);
  });
});
