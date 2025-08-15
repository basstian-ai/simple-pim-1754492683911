// Lightweight in-memory audit logger for API access. In prod send to centralized logs/immutable store.
const auditLog = [];

function auditMiddleware(req, res, next) {
  const start = Date.now();
  const user = req.user || null;
  // capture end event
  function onFinish() {
    const entry = {
      ts: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      user: user ? { subject: user.subject, roles: user.roles } : null
    };
    auditLog.push(entry);
  }
  res.on('finish', onFinish);
  next();
}

function getAuditLog() {
  return auditLog.slice();
}

function clearAuditLog() {
  auditLog.length = 0;
}

module.exports = { auditMiddleware, getAuditLog, clearAuditLog };
