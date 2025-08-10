const groups = require('../../data/attribute-groups.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ groups });
    return;
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: 'Method Not Allowed' });
}
