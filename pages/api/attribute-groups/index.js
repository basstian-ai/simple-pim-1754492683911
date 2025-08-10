import { listGroups, createGroup } from '../../../lib/attributeGroupsStore.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const groups = listGroups().sort((a, b) => a.name.localeCompare(b.name));
      res.status(200).json({ groups });
      return;
    }

    if (req.method === 'POST') {
      const { name } = req.body || {};
      const created = createGroup({ name });
      res.status(201).json(created);
      return;
    }

    res.setHeader('Allow', 'GET,POST');
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e) {
    const status = e.statusCode || 500;
    res.status(status).json({ error: e.message || 'Server error' });
  }
}
