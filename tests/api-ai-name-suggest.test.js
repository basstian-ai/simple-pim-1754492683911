import handler from '../pages/api/ai/name-suggest';

function createRes() {
  return {
    _status: 0,
    _json: undefined,
    status(code) { this._status = code; return this; },
    json(data) { this._json = data; return this; }
  };
}

describe('API /api/ai/name-suggest', () => {
  it('returns suggestions array (GET)', async () => {
    const req = { method: 'GET', query: { q: 'eco bamboo toothbrush', n: '3' } };
    const res = createRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(Array.isArray(res._json)).toBe(true);
    expect(res._json.length).toBeGreaterThan(0);
  });

  it('respects count limit (POST)', async () => {
    const req = { method: 'POST', body: { input: 'steel water bottle', count: 2 } };
    const res = createRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(Array.isArray(res._json)).toBe(true);
    expect(res._json.length).toBeLessThanOrEqual(2);
  });
});
