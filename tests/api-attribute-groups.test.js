const assert = require('assert');
const handler = require('../pages/api/attribute-groups.js');

function mockReq(method = 'GET') {
  return { method };
}

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    finished: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    json(obj) {
      this.body = obj;
      this.finished = true;
    },
    end(str) {
      this.body = str;
      this.finished = true;
    }
  };
  return res;
}

// Simple invocation test
(function testGetAttributeGroups() {
  const req = mockReq('GET');
  const res = mockRes();
  handler(req, res);

  assert.strictEqual(res.statusCode, 200, 'should return 200');
  assert.ok(res.finished, 'response should be finished');
  assert.ok(res.body, 'should have a body');
  assert.ok(Array.isArray(res.body.groups), 'groups should be an array');
  const ids = res.body.groups.map((g) => g.id);
  assert.ok(ids.includes('basic'), 'should include basic group');
  assert.ok(ids.includes('seo'), 'should include seo group');
  // If it reaches here, output a tiny success message so running with `node` shows progress.
  if (require.main === module) {
    // eslint-disable-next-line no-console
    console.log('✓ api-attribute-groups GET test passed');
  }
})();

// method not allowed test
(function testMethodNotAllowed() {
  const req = mockReq('POST');
  const res = mockRes();
  handler(req, res);

  assert.strictEqual(res.statusCode, 405, 'should return 405 for non-GET');
  assert.ok(res.finished, 'response should be finished');
  assert.deepStrictEqual(res.body, { error: 'Method Not Allowed' });
  if (require.main === module) {
    // eslint-disable-next-line no-console
    console.log('✓ api-attribute-groups method not allowed test passed');
  }
})();
