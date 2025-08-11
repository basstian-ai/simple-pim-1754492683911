const path = require('path');

describe('/api/attribute-groups/search', () => {
  function createMockRes() {
    const res = {
      statusCode: 200,
      headers: {},
      body: undefined,
      setHeader(name, value) { this.headers[name] = value; },
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.body = payload; return this; },
    };
    return res;
  }

  it('returns flattened attributes with count', async () => {
    const mod = require(path.join('..', 'pages', 'api', 'attribute-groups', 'search.js'));
    const handler = mod.default || mod;

    const req = { method: 'GET', query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(typeof res.body.count).toBe('number');
    expect(Array.isArray(res.body.attributes)).toBe(true);
    if (res.body.attributes.length > 0) {
      const a = res.body.attributes[0];
      expect(a).toHaveProperty('code');
      expect(a).toHaveProperty('label');
      expect(a).toHaveProperty('groupId');
      expect(a).toHaveProperty('groupName');
    }
  });

  it('respects the q filter and returns empty for gibberish', async () => {
    const mod = require(path.join('..', 'pages', 'api', 'attribute-groups', 'search.js'));
    const handler = mod.default || mod;

    const req = { method: 'GET', query: { q: 'this-term-should-not-exist-xyz123' } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.attributes)).toBe(true);
    expect(res.body.attributes.length).toBe(0);
    expect(typeof res.body.count).toBe('number');
  });
});
