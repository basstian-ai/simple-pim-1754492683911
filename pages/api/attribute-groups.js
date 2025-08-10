import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');

function loadAttributeGroups() {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  return data && Array.isArray(data.groups) ? data.groups : [];
}

export default function handler(req, res) {
  try {
    const groups = loadAttributeGroups();

    if (req.method === 'GET') {
      const { flat } = req.query || {};
      if (flat === '1' || flat === 'true') {
        const attributes = groups.flatMap((g) =>
          (g.attributes || []).map((a) => ({
            groupId: g.id,
            groupName: g.name,
            ...a,
          }))
        );
        return res.status(200).json({ attributes, count: attributes.length });
      }

      return res.status(200).json({ groups, count: groups.length });
    }

    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load attribute groups' });
  }
}
