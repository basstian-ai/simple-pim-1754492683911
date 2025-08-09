/*
 Minimal test for the Attribute Groups API without any test runner.
 Usage: node scripts/test-attribute-groups.js
 Exits with non-zero code on failure.
*/

const path = require('path');

function createMockRes() {
  const headers = {};
  return {
    _status: 200,
    _json: null,
    setHeader(key, value) {
      headers[key.toLowerCase()] = value;
    },
    status(code) {
      this._status = code;
      return this;
    },
    json(obj) {
      this._json = obj;
      return this;
    },
  };
}

async function call(handler, method, body) {
  const req = { method, body };
  const res = createMockRes();
  await handler(req, res);
  return { status: res._status, body: res._json };
}

async function main() {
  const handler = require(path.resolve(__dirname, '../pages/api/attribute-groups'));

  // Initial list
  let r = await call(handler.default || handler, 'GET');
  if (r.status !== 200 || !Array.isArray(r.body.items)) {
    throw new Error('GET should return { items: [...] } with 200');
  }
  const initialCount = r.body.items.length;

  // Create new group
  r = await call(handler.default || handler, 'POST', { name: 'Size', code: 'size' });
  if (r.status !== 201 || !r.body || r.body.code !== 'size') {
    throw new Error('POST should create and return the group with 201');
  }

  // List increased by 1
  r = await call(handler.default || handler, 'GET');
  if (r.body.items.length !== initialCount + 1) {
    throw new Error('GET should include the newly created group');
  }

  // Duplicate code should 409
  r = await call(handler.default || handler, 'POST', { name: 'Duplicate Size', code: 'size' });
  if (r.status !== 409) {
    throw new Error('POST with duplicate code should return 409');
  }

  console.log('Attribute Groups API test: OK');
}

main().catch((err) => {
  console.error('Attribute Groups API test: FAILED');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
