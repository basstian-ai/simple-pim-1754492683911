const handlerModule = require('../pages/api/attribute-groups/flat');
const handler = handlerModule.default || handlerModule;

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('GET /api/attribute-groups/flat', () => {
  test('returns flattened attributes with group metadata', async () => {
    const req = { method: 'GET', query: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.attributes)).toBe(true);
    expect(res.body.count).toBe(res.body.attributes.length);
    const first = res.body.attributes[0];
    expect(first).toHaveProperty('groupId');
    expect(first).toHaveProperty('groupName');
  });

  test('supports filtering by type and q and groupId', async () => {
    const req = { method: 'GET', query: { type: 'text' } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.attributes)).toBe(true);
    // All returned must match the requested type
    for (const a of res.body.attributes) {
      expect(String(a.type)).toBe('text');
    }

    const groups = require('../data/attribute-groups.json');
    const oneGroup = Array.isArray(groups) && groups[0] ? groups[0] : null;
    if (oneGroup) {
      const req2 = { method: 'GET', query: { groupId: String(oneGroup.id), q: String(oneGroup.name).slice(0, 2) } };
      const res2 = createMockRes();
      await handler(req2, res2);
      expect(res2.statusCode).toBe(200);
      for (const a of res2.body.attributes) {
        expect(String(a.groupId)).toBe(String(oneGroup.id));
      }
    }
  });

  test('rejects non-GET methods', async () => {
    const req = { method: 'POST', body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toHaveProperty('error');
  });
});
