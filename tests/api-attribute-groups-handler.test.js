import handler from '../pages/api/attribute-groups';

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

test('GET /api/attribute-groups returns groups', async () => {
  const req = { method: 'GET', query: {} };
  const res = createMockRes();
  await handler(req, res);
  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(Array.isArray(res.body.groups)).toBe(true);
  expect(res.body.count).toBeGreaterThan(0);
});

test('GET /api/attribute-groups?flat=1 returns flattened attributes', async () => {
  const req = { method: 'GET', query: { flat: '1' } };
  const res = createMockRes();
  await handler(req, res);
  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(Array.isArray(res.body.attributes)).toBe(true);
  expect(res.body.count).toBeGreaterThan(0);
  // Contains group metadata on flattened entries
  const first = res.body.attributes[0];
  expect(first).toHaveProperty('groupId');
  expect(first).toHaveProperty('groupName');
});
