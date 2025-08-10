const assert = require('assert');
const handler = require('../pages/api/attributes');

function createMockRes() {
  let statusCode = 200;
  const headers = {};
  let body = undefined;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    setHeader(key, val) {
      headers[key] = val;
    },
    json(data) {
      body = data;
      return this;
    },
    end() {
      return this;
    },
    _get() {
      return { statusCode, headers, body };
    },
  };
}

// GET should return groups and attributes
{
  const res = createMockRes();
  handler({ method: 'GET' }, res);
  const out = res._get();
  assert.strictEqual(out.statusCode, 200);
  assert.ok(out.body && Array.isArray(out.body.groups), 'groups should be array');
  assert.ok(out.body && Array.isArray(out.body.attributes), 'attributes should be array');
  assert.ok(out.body.groups.length >= 1, 'at least one group');
}

// Non-GET should be 405
{
  const res = createMockRes();
  handler({ method: 'POST' }, res);
  const out = res._get();
  assert.strictEqual(out.statusCode, 405);
}

console.log('api-attributes.test.js: OK');
