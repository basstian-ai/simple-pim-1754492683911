const path = require('path');

function getHandler() {
  const mod = require(path.join('..', 'pages', 'api', 'attribute-groups', 'export.js'));
  return mod.default || mod;
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end(data) {
      this.body = data;
      return this;
    },
    send(data) {
      return this.end(data);
    },
    json(obj) {
      this.setHeader('Content-Type', 'application/json');
      return this.end(JSON.stringify(obj));
    },
  };
  return res;
}

describe('API: Attribute Groups Export CSV', () => {
  test('returns CSV with expected headers and row count', async () => {
    const handler = getHandler();
    const req = { method: 'GET' };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);

    const contentType = Object.keys(res.headers).find(
      (k) => k.toLowerCase() === 'content-type'
    );
    expect(res.headers[contentType]).toMatch(/text\/csv/);

    const csv = String(res.body || '');
    const lines = csv.trim().split('\n');
    expect(lines[0]).toBe('id,name,attributesCount,attributes');

    const groups = require(path.join('..', 'data', 'attribute-groups.json'));
    const expectedCount = Array.isArray(groups) ? groups.length : 0;
    expect(lines.length - 1).toBe(expectedCount);
  });

  test('rejects non-GET methods', async () => {
    const handler = getHandler();
    const req = { method: 'POST' };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    const contentType = Object.keys(res.headers).find(
      (k) => k.toLowerCase() === 'content-type'
    );
    expect(res.headers[contentType]).toMatch(/application\/json/);
    const payload = JSON.parse(res.body);
    expect(payload.error).toBeDefined();
  });
});
