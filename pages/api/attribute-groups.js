import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load attribute groups' });
  }
}
