const assert = require('assert');
const handler = require('../pages/api/attributes/index.js');

function createMocks(method = 'GET', body = null) {
  let statusCode = 200;
  const headers = {};
  let jsonData = null;
  let ended = false;

  const req = { method, body };
  const res = {
    setHeader: (k, v) => {
      headers[k] = v;
    },
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      jsonData = data;
      ended = true;
      return res;
    },
    end: () => {
      ended = true;
      return res;
    },
  };

  return { req, res, get statusCode() { return statusCode; }, headers, get json() { return jsonData; }, get ended() { return ended; } };
}

async function run() {
  const mocks = createMocks('GET');
  await handler(mocks.req, mocks.res);
  assert.strictEqual(mocks.statusCode, 200, 'GET should return 200');
  assert.ok(mocks.json, 'Response should have JSON');
  assert.ok(Array.isArray(mocks.json.groups), 'groups array present');
  console.log('ok - /api/attributes GET returns groups');
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { run };
