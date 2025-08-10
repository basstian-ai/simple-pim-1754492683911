const fs = require('fs');
const path = require('path');
const os = require('os');
const handler = require('../pages/api/attribute-groups');

function createMockRes() {
  const res = {};
  res._status = 200;
  res._headers = {};
  res._data = '';
  res.statusCode = 200;
  res.setHeader = (k, v) => {
    res._headers[k.toLowerCase()] = v;
  };
  res.end = (data) => {
    if (typeof data === 'string' || Buffer.isBuffer(data)) {
      res._data += data.toString();
    } else if (data) {
      res._data += String(data);
    }
    return res;
  };
  return res;
}

function createMockReq(method, body) {
  return {
    method,
    body,
    headers: { 'content-type': 'application/json' },
  };
}

async function runHandler(method, body) {
  const req = createMockReq(method, body);
  const res = createMockRes();
  await handler(req, res);
  return res;
}

// A very small smoke test for the API handler
(async function main() {
  const tmpFile = path.join(os.tmpdir(), `attr-groups-test-${Date.now()}.json`);
  process.env.ATTR_GROUPS_FILE = tmpFile;
  fs.writeFileSync(tmpFile, '[]', 'utf8');

  let res = await runHandler('POST', { name: 'Colors', description: 'Basic color attributes' });
  if (res.statusCode !== 201) {
    throw new Error('Expected 201 on create, got ' + res.statusCode + ' data=' + res._data);
  }

  res = await runHandler('GET');
  if (res.statusCode !== 200) {
    throw new Error('Expected 200 on list');
  }
  const list = JSON.parse(res._data || '[]');
  if (!Array.isArray(list) || list.length !== 1 || list[0].name !== 'Colors') {
    throw new Error('List response invalid: ' + res._data);
  }

  // Duplicate name should 409
  res = await runHandler('POST', { name: 'Colors' });
  if (res.statusCode !== 409) {
    throw new Error('Expected 409 on duplicate name, got ' + res.statusCode);
  }

  // Clean up
  try { fs.unlinkSync(tmpFile); } catch (e) {}
  // eslint-disable-next-line no-console
  console.log('API attribute-groups smoke test passed');
})();
