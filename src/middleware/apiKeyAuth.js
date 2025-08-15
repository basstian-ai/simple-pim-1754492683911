const credentialStore = require('../credentialStore');

// Middleware that validates x-api-key header and attaches req.user = { apiKey, roles, subject }
function apiKeyAuth(req, res, next) {
  const apiKey = (req.header('x-api-key') || '').trim();
  if (!apiKey) {
    return res.status(401).json({ error: 'missing_api_key' });
  }
  const entry = credentialStore.getEntry(apiKey);
  if (!entry) {
    return res.status(401).json({ error: 'invalid_or_inactive_api_key' });
  }
  req.user = { apiKey, roles: entry.roles.slice(), subject: entry.subject };
  next();
}

module.exports = apiKeyAuth;
