import { getGroup, updateGroup, deleteGroup } from '../../../lib/memoryStore';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const {
    query: { id },
  } = req;

  if (!id) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  if (req.method === 'GET') {
    const group = getGroup(id);
    if (!group) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(200).json(group);
    return;
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { name, attributes } = req.body || {};
      const patch = {};
      if (name !== undefined) patch.name = name;
      if (attributes !== undefined) {
        if (!Array.isArray(attributes)) {
          res.status(400).json({ error: 'attributes must be an array' });
          return;
        }
        patch.attributes = attributes;
      }
      const updated = updateGroup(id, patch);
      if (!updated) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json(updated);
      return;
    } catch (e) {
      res.status(500).json({ error: 'Failed to update attribute group' });
      return;
    }
  }

  if (req.method === 'DELETE') {
    const ok = deleteGroup(id);
    if (!ok) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(204).end();
    return;
  }

  res.setHeader('Allow', 'GET, PUT, PATCH, DELETE');
  res.status(405).json({ error: 'Method Not Allowed' });
}
