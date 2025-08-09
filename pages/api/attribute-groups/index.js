import {
  listAttributeGroups,
  createAttributeGroup,
} from '../../../lib/attributeGroupsStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = listAttributeGroups();
    res.status(200).json({ data });
    return;
  }

  if (req.method === 'POST') {
    const { code, name, description } = req.body || {};
    const result = createAttributeGroup({ code, name, description });
    if (result.ok) {
      res.status(result.status).json({ item: result.item });
    } else {
      res.status(result.status).json({ errors: result.errors || {} });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: 'Method Not Allowed' });
}
