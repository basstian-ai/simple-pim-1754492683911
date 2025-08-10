const assert = require('assert');
const os = require('os');
const path = require('path');
const fs = require('fs');

process.env.ATTRIBUTE_GROUPS_PATH = path.join(os.tmpdir(), `simple-pim-attr-groups-test-${Date.now()}.json`);

const indexHandler = require('../pages/api/attribute-groups/index.js').default;
const idHandler = require('../pages/api/attribute-groups/[id].js').default;

function mockReq({ method = 'GET', query = {}, body = undefined } = {}) {
  return { method, query, body, headers: {} };
}

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.body = undefined;
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  res.end = (data) => { res.body = data; return res; };
  return res;
}

async function run() {
  // Ensure file doesn't exist at start
  try { fs.unlinkSync(process.env.ATTRIBUTE_GROUPS_PATH); } catch (_) {}

  // GET should return empty list
  let req = mockReq({ method: 'GET' });
  let res = mockRes();
  await indexHandler(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.ok(Array.isArray(res.body.groups));
  assert.strictEqual(res.body.groups.length, 0);

  // POST create one
  req = mockReq({ method: 'POST', body: { name: 'Specifications' } });
  res = mockRes();
  await indexHandler(req, res);
  assert.strictEqual(res.statusCode, 201);
  assert.ok(res.body && res.body.id);
  const createdId = res.body.id;

  // GET should now include it
  req = mockReq({ method: 'GET' });
  res = mockRes();
  await indexHandler(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.groups.length, 1);
  assert.strictEqual(res.body.groups[0].name, 'Specifications');

  // DELETE it
  req = mockReq({ method: 'DELETE', query: { id: createdId } });
  res = mockRes();
  await idHandler(req, res);
  assert.strictEqual(res.statusCode, 204);

  // GET again empty
  req = mockReq({ method: 'GET' });
  res = mockRes();
  await indexHandler(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.groups.length, 0);

  console.log('PASS attribute-groups API');
}

run().catch((e) => {
  console.error('FAIL attribute-groups API');
  console.error(e);
  process.exit(1);
});
