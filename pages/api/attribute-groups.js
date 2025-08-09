import { getAttributeGroups, findAttributeGroup } from '../../lib/attributeGroups';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query || {};
    if (id) {
      const group = findAttributeGroup(String(id));
      if (!group) {
        res.status(404).json({ error: 'Attribute group not found' });
        return;
      }
      res.status(200).json({ group });
      return;
    }
    const groups = getAttributeGroups();
    res.status(200).json({ groups, count: groups.length });
    return;
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: 'Method Not Allowed' });
}
