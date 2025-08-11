const mod = require('../pages/api/slugify');
const handler = mod.default || mod;

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.setHeader = (k, v) => {
    res.headers[k] = v;
  };
  res._data = '';
  res.end = (d = '') => {
    res._data += d;
    res.finished = true;
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (obj) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };
  return res;
}

describe('/api/slugify', () => {
  it('returns a slug for a query param', async () => {
    const req = { method: 'GET', query: { q: 'Hello World!' } };
    const res = createRes();
    await handler(req, res);
    const body = JSON.parse(res._data || '{}');
    expect(body.slug).toBe('hello-world');
    expect(res.statusCode).toBe(200);
  });

  it('returns 405 for unsupported methods', async () => {
    const req = { method: 'PUT', query: {} };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });
});
