const handler = require('../../pages/api/attribute-groups/index.js');

function createMockRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res._json = data; return res; };
  return res;
}

describe('API /api/attribute-groups', () => {
  it('GET returns items array', () => {
    const req = { method: 'GET' };
    const res = createMockRes();
    handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res._json.items)).toBe(true);
  });

  it('POST validates input', () => {
    const badReq = { method: 'POST', body: { name: '', attributes: [] } };
    const res = createMockRes();
    handler(badReq, res);
    expect(res.statusCode).toBe(400);
  });
});
