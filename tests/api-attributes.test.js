const assert = require('assert');
const path = require('path');

const handler = require(path.join(__dirname, '..', 'pages', 'api', 'attributes'));

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res._data = data; return res; };
  return res;
}

(async () => {
  const req = { method: 'GET' };
  const res = mockRes();
  await Promise.resolve(handler(req, res));

  assert.strictEqual(res.statusCode, 200, 'Expected 200 OK');
  assert.ok(Array.isArray(res._data), 'Expected array of attributes');
  assert.ok(res._data.length >= 1, 'Expected at least one attribute');
  const item = res._data[0];
  ['code', 'label', 'type'].forEach((k) => {
    assert.ok(Object.prototype.hasOwnProperty.call(item, k), `Attribute missing ${k}`);
  });

  console.log('api-attributes.test.js passed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
