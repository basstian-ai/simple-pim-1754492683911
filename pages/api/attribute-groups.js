const store = require('../../lib/attributeGroupsStore');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = store.listGroups();
    res.status(200).json({ items });
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const created = store.addGroup({ name: body.name, description: body.description });
      res.status(201).json(created);
    } catch (err) {
      if (err && err.code === 'VALIDATION_ERROR') {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}
