// Simple role-based middleware generator: requireRole('reader') etc.
module.exports = function requireRole(role) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !Array.isArray(user.roles)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    if (!user.roles.includes(role)) {
      return res.status(403).json({ error: 'insufficient_role' });
    }
    next();
  };
};
