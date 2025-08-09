import {
  getAttributeGroup,
  updateAttributeGroup,
  deleteAttributeGroup,
} from '../../../lib/attributeGroupsStore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const item = getAttributeGroup(id);
    if (!item) {
      res.status(404).json({ error: 'Not Found' });
      return;
    }
    res.status(200).json({ item });
    return;
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const result = updateAttributeGroup(id, req.body || {});
    if (result.ok) {
      res.status(result.status).json({ item: result.item });
    } else {
      res.status(result.status).json({ errors: result.errors || {} });
    }
    return;
  }

  if (req.method === 'DELETE') {
    const result = deleteAttributeGroup(id);
    if (result.ok) {
      res.status(200).json({ item: result.item });
    } else {
      res.status(result.status).json({ error: 'Not Found' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
  res.status(405).json({ error: 'Method Not Allowed' });
}
