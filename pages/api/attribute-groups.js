import fs from 'fs';
import path from 'path';

function readAttributeGroups() {
  const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const groups = readAttributeGroups();
    return res.status(200).json({ groups });
  } catch (err) {
    console.error('Failed to load attribute groups:', err);
    return res.status(500).json({ error: 'Failed to load attribute groups' });
  }
}
