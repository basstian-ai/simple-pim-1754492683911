import store from '../../../lib/attributeGroupsStore';

const groupsStore = store && store.list ? store : require('../../../lib/attributeGroupsStore');

export default function handler(req, res) {
  const { method, query, body } = req;
  const { id } = query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'id is required' });
    return;
  }

  if (method === 'GET') {
    const item = groupsStore.findById(id);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.status(200).json({ item });
    return;
  }

  if (method === 'PUT' || method === 'PATCH') {
    try {
      const updated = groupsStore.update(id, body || {});
      if (!updated) return res.status(404).json({ error: 'Not Found' });
      res.status(200).json({ item: updated });
    } catch (e) {
      const status = e.statusCode || 500;
      res.status(status).json({ error: e.message, details: e.details || undefined });
    }
    return;
  }

  if (method === 'DELETE') {
    const ok = groupsStore.remove(id);
    if (!ok) return res.status(404).json({ error: 'Not Found' });
    res.status(204).end();
    return;
  }

  res.setHeader('Allow', 'GET, PUT, PATCH, DELETE');
  res.status(405).json({ error: `Method ${method} Not Allowed` });
}
