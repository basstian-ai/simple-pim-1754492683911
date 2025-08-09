import { getGroups, createGroup } from '../../../lib/memoryStore';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    const groups = getGroups();
    res.status(200).json(groups);
    return;
  }

  if (req.method === 'POST') {
    try {
      const { name } = req.body || {};
      const cleanName = String(name || '').trim();
      if (!cleanName) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }
      const group = createGroup({ name: cleanName });
      res.status(201).json(group);
      return;
    } catch (e) {
      res.status(500).json({ error: 'Failed to create attribute group' });
      return;
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method Not Allowed' });
}
