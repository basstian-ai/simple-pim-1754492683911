import { getGroup, updateGroup, deleteGroup } from '../../../lib/attributeGroupsStore.js';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const group = getGroup(id);
      if (!group) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(group);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const patch = req.body || {};
      const updated = updateGroup(id, patch);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const ok = deleteGroup(id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET,PUT,PATCH,DELETE');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e) {
    const status = e.statusCode || 500;
    res.status(status).json({ error: e.message || 'Server error' });
  }
}
