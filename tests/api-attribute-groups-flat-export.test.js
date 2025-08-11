const handler = require('../pages/api/attribute-groups/flat/export.js');

function createMockRes() {
  const headers = {};
  let statusCode = 200;
  let body;
  return {
    setHeader: (k, v) => { headers[k] = v; },
    status: (c) => { statusCode = c; return res; },
    json: (b) => { body = typeof b === 'string' ? b : JSON.stringify(b); return res; },
    send: (b) => { body = b; return res; },
    get headers() { return headers; },
    get statusCode() { return statusCode; },
    get body() { return body; }
  };
}

const res = createMockRes();

describe('GET /api/attribute-groups/flat/export', () => {
  test('returns CSV with header and at least one row', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toMatch(/text\/csv/);
    expect(typeof res.body).toBe('string');

    const lines = res.body.split('\n');
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0]).toBe('groupId,groupName,code,name,type,required,unit,options');
  });

  test('rejects non-GET methods', async () => {
    const req = { method: 'POST' };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(405);
    const payload = JSON.parse(res.body);
    expect(payload.error).toMatch(/Method Not Allowed/);
    expect(res.headers.Allow).toBe('GET');
  });
});
