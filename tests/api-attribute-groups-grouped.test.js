const path = require('path');

describe('/api/attribute-groups/grouped', () => {
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

  it('returns groups with aggregated counts and total', async () => {
    const mod = require(path.join('..', 'pages', 'api', 'attribute-groups', 'grouped.js'));
    const handler = mod.default || mod;

    const req = { method: 'GET', query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.groups)).toBe(true);
    expect(res.body.groups.length).toBeGreaterThan(0);
    expect(typeof res.body.count).toBe('number');

    const sum = res.body.groups.reduce((acc, g) => acc + (Array.isArray(g.attributes) ? g.attributes.length : 0), 0);
    expect(sum).toBe(res.body.count);

    const first = res.body.groups[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(Array.isArray(first.attributes)).toBe(true);
    if (first.attributes.length > 0) {
      const a = first.attributes[0];
      expect(a).toHaveProperty('groupId', first.id);
      expect(a).toHaveProperty('groupName', first.name);
    }
  });
});
