const request = require('supertest');
const app = require('../src/app');
const credentialStore = require('../src/credentialStore');
const { getAuditLog, clearAuditLog } = require('../src/middleware/audit');

beforeEach(() => {
  credentialStore.reset();
  clearAuditLog();
  // seed keys used by tests
  // alice has reader role
  global.aliceKey = credentialStore.createForSubject('alice', ['reader']);
  // bob has writer role
  global.bobKey = credentialStore.createForSubject('bob', ['writer']);
  // admin has admin role
  global.adminKey = credentialStore.createForSubject('admin', ['admin']);
});

test('reader can GET /items but cannot POST', async () => {
  const res1 = await request(app).get('/items').set('x-api-key', global.aliceKey);
  expect(res1.status).toBe(200);
  expect(Array.isArray(res1.body.items)).toBe(true);

  const res2 = await request(app).post('/items').set('x-api-key', global.aliceKey).send({ id: 'x' });
  expect(res2.status).toBe(403);
  expect(res2.body.error).toBe('insufficient_role');

  const logs = getAuditLog();
  // two entries recorded
  expect(logs.length).toBeGreaterThanOrEqual(2);
  const paths = logs.map(l => l.path);
  expect(paths).toEqual(expect.arrayContaining(['/items', '/items']));
});

test('writer can POST but cannot GET if lacking reader role', async () => {
  const res1 = await request(app).post('/items').set('x-api-key', global.bobKey).send({ id: 'x' });
  expect(res1.status).toBe(201);

  const res2 = await request(app).get('/items').set('x-api-key', global.bobKey);
  expect(res2.status).toBe(403);
});

test('missing or invalid key returns 401', async () => {
  const res = await request(app).get('/items');
  expect(res.status).toBe(401);

  const res2 = await request(app).get('/items').set('x-api-key', 'not-a-key');
  expect(res2.status).toBe(401);
});
