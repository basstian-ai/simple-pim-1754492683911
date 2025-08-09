import { getGroup, updateGroup, deleteGroup } from '../../../lib/attributeGroups';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { id } = req.query;
  try {
    if (req.method === 'GET') {
      const g = getGroup(id);
      if (!g) {
        res.status(404).send(JSON.stringify({ error: 'Not found' }));
        return;
      }
      res.status(200).send(JSON.stringify({ data: g }));
      return;
    }
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const updated = updateGroup(id, req.body || {});
      res.status(200).send(JSON.stringify({ data: updated }));
      return;
    }
    if (req.method === 'DELETE') {
      const removed = deleteGroup(id);
      res.status(200).send(JSON.stringify({ data: removed }));
      return;
    }
    res.setHeader('Allow', 'GET, PUT, PATCH, DELETE');
    res.status(405).send(JSON.stringify({ error: 'Method Not Allowed' }));
  } catch (e) {
    const status = e && e.statusCode ? e.statusCode : 500;
    res.status(status).send(JSON.stringify({ error: e.message || 'Server error' }));
  }
}
