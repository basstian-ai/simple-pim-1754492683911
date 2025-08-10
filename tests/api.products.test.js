const assert = require('assert');
const handler = require('../pages/api/products').default || require('../pages/api/products');

function createMockRes() {
  const res = {};
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.end = (data) => { res.ended = true; res.body = data; };
  res.statusCode = 200;
  return res;
}

async function run() {
  // GET initial products
  {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 200, 'GET status 200');
    const payload = JSON.parse(res.body);
    assert(Array.isArray(payload.items), 'GET returns items array');
    assert(payload.items.length >= 1, 'seeded products present');
  }

  // POST create a product
  let createdId = null;
  {
    const req = { method: 'POST', body: { name: 'Test Product', sku: 'TEST-001', price: 5.5 } };
    const res = createMockRes();
    await handler(req, res);
    assert.strictEqual(res.statusCode, 201, 'POST status 201');
    const payload = JSON.parse(res.body);
    createdId = payload.id;
    assert(payload.name === 'Test Product', 'created name matches');
    assert(payload.sku === 'TEST-001', 'created sku matches');
    assert.strictEqual(typeof createdId, 'string', 'created id is string');
  }

  // GET again and ensure count increased
  {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);
    const payload = JSON.parse(res.body);
    const found = payload.items.find((p) => p.id === createdId);
    assert(found, 'created product is in list');
  }

  console.log('api.products.test.js ok');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
