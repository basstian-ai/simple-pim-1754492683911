const handler = require('../pages/api/products/stats').default || require('../pages/api/products/stats');
const products = require('../data/products.json');

function mockRes() {
  const res = {};
  res.statusCode = 0;
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (code) => { res.statusCode = code; return res; };
  let jsonBody = undefined;
  res.json = (data) => { jsonBody = data; return res; };
  res._getJSON = () => jsonBody;
  return res;
}

describe('/api/products/stats', () => {
  test('GET returns stats with totals matching products dataset', async () => {
    const req = { method: 'GET' };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const body = res._getJSON();
    expect(body).toBeTruthy();
    expect(body.totalProducts).toBe(Array.isArray(products) ? products.length : 0);
    expect(typeof body.inStock).toBe('number');
    expect(Array.isArray(body.tags)).toBe(true);
  });

  test('method not allowed on non-GET', async () => {
    const req = { method: 'POST' };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    const body = res._getJSON();
    expect(body && body.error).toBeDefined();
  });
});
