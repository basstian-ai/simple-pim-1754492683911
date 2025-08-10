import { normalizeGroup, validateGroup } from '../../lib/attributeGroups';

// In-memory store (ephemeral across deployments/instances). Suitable for demo.
let groups = [];

export default function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    res.status(200).json({ groups });
    return;
  }

  if (method === 'POST') {
    const normalized = normalizeGroup(req.body || {});
    const { valid, errors } = validateGroup(normalized);
    if (!valid) {
      res.status(400).json({ error: 'Validation failed', errors });
      return;
    }
    groups.push(normalized);
    res.status(201).json({ group: normalized });
    return;
  }

  if (method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }
    const before = groups.length;
    groups = groups.filter((g) => g.id !== id);
    if (groups.length === before) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.status(204).end();
    return;
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end('Method Not Allowed');
}
