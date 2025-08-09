import handler from '../pages/api/tags';

describe('/api/tags', () => {
  function createMockRes() {
    const res = {};
    res.statusCode = 200;
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res._data = data; return res; };
    return res;
  }

  it('returns a list of tags', async () => {
    const req = { query: {} };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res._data)).toBe(true);
    // Tags should be strings
    if (res._data.length > 0) {
      expect(typeof res._data[0]).toBe('string');
    }
  });

  it('supports search filtering', async () => {
    const req = { query: { search: 'red' } };
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res._data)).toBe(true);
    res._data.forEach((t) => {
      expect(typeof t).toBe('string');
      expect(t.toLowerCase()).toEqual(expect.stringContaining('red'));
    });
  });
});
