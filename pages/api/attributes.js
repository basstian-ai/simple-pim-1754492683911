const { loadAttributes } = require('../../lib/attributes');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const attrs = loadAttributes();
    return res.status(200).json({ attributes: attrs });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load attributes' });
  }
}
