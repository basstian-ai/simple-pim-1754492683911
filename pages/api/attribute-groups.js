import { NextApiRequest, NextApiResponse } from 'next';
const store = require('../../lib/store/attributeGroups');

export default async function handler(req, res) {
  try {
    const { method } = req;
    if (method === 'GET') {
      const { id } = req.query;
      if (id) {
        const group = store.getGroup(id);
        if (!group) return res.status(404).json({ error: 'not_found' });
        return res.status(200).json(group);
      }
      const groups = store.listGroups();
      return res.status(200).json({ items: groups, total: groups.length });
    }

    if (method === 'POST') {
      const { name, description } = req.body || {};
      const created = store.createGroup({ name, description });
      return res.status(201).json(created);
    }

    if (method === 'PUT') {
      const { id, name, description, attributes } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id_required' });
      const updated = store.updateGroup(id, { name, description, attributes });
      return res.status(200).json(updated);
    }

    if (method === 'DELETE') {
      const id = req.query.id || (req.body && req.body.id);
      if (!id) return res.status(400).json({ error: 'id_required' });
      const removed = store.deleteGroup(id);
      return res.status(200).json(removed);
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE');
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (err) {
    const status = err && err.statusCode ? err.statusCode : 500;
    return res.status(status).json({ error: err.message || 'internal_error' });
  }
}
