const { validateGroups } = require('../../../lib/attributeGroupsSchema');

function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  const result = validateGroups(payload);
  if (!result.valid) {
    return res.status(400).json(result);
  }
  return res.status(200).json(result);
}

module.exports = handler;
