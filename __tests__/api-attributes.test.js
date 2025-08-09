const handlerModule = require('../pages/api/attributes');
const handler = handlerModule.default || handlerModule;

function createMockRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.setHeader = (k, v) => {
    res.headers[k] = v;
  };
  res.jsonData = undefined;
  res.json = (data) => {
    res.jsonData = data;
    return res;
  };
  return res;
}

describe('GET /api/attributes', () => {
  it('returns attribute groups payload', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toBeDefined();
    expect(res.jsonData.ok).toBe(true);
    expect(Array.isArray(res.jsonData.groups)).toBe(true);
    expect(res.jsonData.groups.length).toBeGreaterThan(0);
    const first = res.jsonData.groups[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('attributes');
  });

  it('rejects non-GET methods', async () => {
    const req = { method: 'POST' };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.jsonData.ok).toBe(false);
  });
});
