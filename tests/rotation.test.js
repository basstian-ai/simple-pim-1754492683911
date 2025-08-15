const request = require('supertest');
const app = require('../src/app');
const credentialStore = require('../src/credentialStore');
const { clearAuditLog, getAuditLog } = require('../src/middleware/audit');

beforeEach(() => {
  credentialStore.reset();
  clearAuditLog();
  // seed admin key used to rotate
  global.adminKey = credentialStore.createForSubject('admin', ['admin']);
  global.aliceKey = credentialStore.createForSubject('alice', ['reader']);
});

test('rotation produces a new key and invalidates old keys for subject', async () => {
  // admin rotates alice
  const res = await request(app)
    .post('/rotate')
    .set('x-api-key', global.adminKey)
    .send({ subject: 'alice', roles: ['reader'] });

  expect(res.status).toBe(200);
  expect(res.body.ok).toBeTruthy();
  expect(res.body.subject).toBe('alice');
  const newKey = res.body.newKey;
  expect(typeof newKey).toBe('string');

  // old key should now be invalid
  const oldRes = await request(app).get('/items').set('x-api-key', global.aliceKey);
  expect(oldRes.status).toBe(401);

  // new key should work
  const newRes = await request(app).get('/items').set('x-api-key', newKey);
  expect(newRes.status).toBe(200);

  // audit should have recorded the rotate call (admin) and subsequent attempts
  const logs = getAuditLog();
  expect(logs.find(l => l.path === '/rotate')).toBeTruthy();
});

test('only admin can rotate', async () => {
  // non-admin trying to rotate
  const res = await request(app).post('/rotate').set('x-api-key', global.aliceKey).send({ subject: 'alice' });
  expect(res.status).toBe(403);
});
