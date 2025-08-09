const { getAttributeGroups } = require('../../lib/attributeGroups');

function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ groups: getAttributeGroups() });
    return;
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: 'Method Not Allowed' });
}

export default handler;
