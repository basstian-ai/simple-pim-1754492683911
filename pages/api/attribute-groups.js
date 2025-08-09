export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // load statically bundled JSON
    const groups = require('../../data/attribute-groups.json');
    res.status(200).json({ groups, count: groups.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load attribute groups' });
  }
}
