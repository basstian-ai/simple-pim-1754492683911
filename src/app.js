const express = require('express');
const bodyParser = require('body-parser');
const credentialStore = require('./credentialStore');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const requireRole = require('./middleware/acl');
const { auditMiddleware } = require('./middleware/audit');

const app = express();
app.use(bodyParser.json());

// Audit should be after auth so it can capture user info. For unauthenticated requests we still get logs in auth middleware.
app.use(apiKeyAuth);
app.use(auditMiddleware);

// Example resources that demonstrate least-privilege access control
app.get('/items', requireRole('reader'), (req, res) => {
  // in reality we'd return paginated product data
  res.json({ ok: true, items: [{ id: 'sku-1', title: 'Example' }] });
});

app.post('/items', requireRole('writer'), (req, res) => {
  const payload = req.body || {};
  // persist with transactional guarantees in real app
  res.status(201).json({ ok: true, created: payload });
});

// Credential rotation endpoint: admin-only. Rotates keys for a given subject and returns the new key.
app.post('/rotate', requireRole('admin'), (req, res) => {
  const { subject, roles } = req.body || {};
  if (!subject) return res.status(400).json({ error: 'missing_subject' });
  // Rotate and deactivate old keys for subject
  const newKey = credentialStore.rotateSubject(subject, roles || ['reader']);
  // In production the plaintext secret should be shown only once over a secure channel
  res.json({ ok: true, subject, newKey });
});

// Health endpoint (no auth) - keep out of middleware chain by mounting before
// (but our app mounted auth globally; for demo, expose a simple ping if header present otherwise 200)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

if (require.main === module) {
  const port = process.env.PORT || 3000;
  // Seed some demo keys if none exist (useful when running locally)
  if ([...credentialStore.keys.keys()].length === 0) {
    credentialStore.createForSubject('alice', ['reader']);
    credentialStore.createForSubject('bob', ['writer']);
    credentialStore.createForSubject('admin', ['admin']);
    console.log('seeded demo credentials - start a request with x-api-key header');
  }
  app.listen(port, () => console.log('listening on', port));
}

module.exports = app;
