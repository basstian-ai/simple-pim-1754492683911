const { getAttributeGroups } = require('../../lib/attributeGroups');

function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { q } = req.query || {};
  const data = getAttributeGroups(q);

  return res.status(200).json({
    ok: true,
    count: data.length,
    groups: data
  });
}

module.exports = handler;
