/*
 Minimal test for Attribute Groups API handler.
 Run with: node tests/api/attribute-groups.test.js
*/

const assert = require('assert');
const { handler } = require('../../lib/api/attributeGroupsHandler');

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; this.ended = true; return this; },
    end() { this.ended = true; }
  };
}

async function call(method, body) {
  const req = { method, body };
  const res = createRes();
  await handler(req, res);
  return res;
}

(async function run() {
  // initial list
  let res = await call('GET');
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.body.ok);
  assert.ok(Array.isArray(res.body.data));
  const initialLen = res.body.data.length;
  assert.ok(res.body.data.some((g) => g.code === 'basic'));

  // create new
  res = await call('POST', { code: 'marketing', name: 'Marketing Attributes' });
  assert.strictEqual(res.statusCode, 201);
  assert.ok(res.body.ok);
  assert.strictEqual(res.body.data.code, 'marketing');

  // list again should include new one
  res = await call('GET');
  assert.strictEqual(res.statusCode, 200);
  const codes = res.body.data.map((g) => g.code);
  assert.ok(codes.includes('marketing'));
  assert.strictEqual(res.body.data.length, initialLen + 1);

  console.log('OK - attribute groups API basic flow');
})().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
