import store from '../../../lib/attributeGroupsStore';

// Support both ES import default and CommonJS require
const groupsStore = store && store.list ? store : require('../../../lib/attributeGroupsStore');

export default function handler(req, res) {
  const { method, query, body } = req;

  if (method === 'GET') {
    const q = typeof query.q === 'string' ? query.q : undefined;
    const items = groupsStore.list({ q });
    res.status(200).json({ items, count: items.length });
    return;
  }

  if (method === 'POST') {
    try {
      const created = groupsStore.create(body || {});
      res.status(201).json({ item: created });
    } catch (e) {
      const status = e.statusCode || 500;
      res.status(status).json({ error: e.message, details: e.details || undefined });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: `Method ${method} Not Allowed` });
}
