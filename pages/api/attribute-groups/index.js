import { listGroups, createGroup } from '../../../lib/attributeGroups';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    if (req.method === 'GET') {
      const all = listGroups();
      res.status(200).send(JSON.stringify({ data: all }));
      return;
    }
    if (req.method === 'POST') {
      const created = createGroup(req.body || {});
      res.status(201).send(JSON.stringify({ data: created }));
      return;
    }
    res.setHeader('Allow', 'GET, POST');
    res.status(405).send(JSON.stringify({ error: 'Method Not Allowed' }));
  } catch (e) {
    const status = e && e.statusCode ? e.statusCode : 500;
    res.status(status).send(JSON.stringify({ error: e.message || 'Server error' }));
  }
}
