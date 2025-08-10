const { queryAttributeGroups } = require('../../lib/attributeGroups');

module.exports = function handler(req, res) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    const q = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
    const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const items = queryAttributeGroups({ q, limit });

    res.status(200).json({ items, total: items.length });
    return;
  }

  res.setHeader('Allow', ['GET', 'HEAD']);
  res.status(405).json({ error: 'Method Not Allowed' });
};
