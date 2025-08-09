/** @jest-environment node */

const handler = require('../pages/api/products/export').default;

function createMockReqRes(method = 'GET') {
  const req = { method, headers: {}, query: {} };
  const headers = {};
  const res = {
    statusCode: 200,
    headers,
    body: '',
    finished: false,
    setHeader(key, val) {
      headers[String(key).toLowerCase()] = val;
    },
    getHeader(key) {
      return headers[String(key).toLowerCase()];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end(payload) {
      if (payload !== undefined) this.body += payload;
      this.finished = true;
      return this;
    },
    send(payload) {
      return this.end(payload);
    },
    json(obj) {
      return this.send(JSON.stringify(obj));
    },
  };
  return { req, res };
}

describe('API /api/products/export', () => {
  it('returns CSV with proper headers', async () => {
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const ct = res.getHeader('content-type');
    expect(ct).toMatch(/text\/csv/);
    const cd = res.getHeader('content-disposition');
    expect(cd).toMatch(/attachment/);
    expect(typeof res.body).toBe('string');
    // basic sanity: header line and at least one comma
    expect(res.body.split('\n')[0]).toContain(',');
    expect(res.body.length).toBeGreaterThan(10);
  });

  it('rejects non-GET methods', async () => {
    const { req, res } = createMockReqRes('POST');
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.getHeader('allow')).toBe('GET');
  });
});
