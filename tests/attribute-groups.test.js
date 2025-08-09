const assert = require('assert');
const path = require('path');

const handler = require(path.join('..', 'pages', 'api', 'attribute-groups.js'));

function runApi(method, body) {
  return new Promise((resolve) => {
    const req = { method, body };
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(key, value) { this.headers[key] = value; },
      end(payload) {
        this.payload = payload;
        resolve(this);
      },
    };
    Promise.resolve(handler(req, res)).catch((e) => {
      res.statusCode = 500;
      res.payload = JSON.stringify({ error: e && e.message ? e.message : String(e) });
      resolve(res);
    });
  }).then((res) => {
    let json = null;
    try { json = JSON.parse(res.payload); } catch (e) { json = null; }
    return { statusCode: res.statusCode, json, headers: res.headers };
  });
}

(async () => {
  // Test GET returns an array of groups
  const get1 = await runApi('GET');
  assert.strictEqual(get1.statusCode, 200, 'GET should return 200');
  assert.ok(get1.json && Array.isArray(get1.json.groups), 'GET should return { groups: [] }');

  // Test POST creates a new group and subsequent GET includes it (in-memory)
  const uniqueName = 'Test Group ' + Date.now();
  const post = await runApi('POST', { name: uniqueName, attributes: 'a,b,c' });
  assert.strictEqual(post.statusCode, 201, 'POST should return 201');
  assert.ok(post.json && post.json.group && post.json.group.name === uniqueName, 'POST should return created group');

  const get2 = await runApi('GET');
  const names = (get2.json.groups || []).map((g) => g.name);
  assert.ok(names.includes(uniqueName), 'GET after POST should include the new group');

  // Basic output for manual runs
  // eslint-disable-next-line no-console
  console.log('attribute-groups.test.js OK');
})().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
