import fs from 'fs';
import path from 'path';

function safeSlugify(input) {
  if (!input) return '';
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function loadGroupsFromDisk() {
  const file = path.join(process.cwd(), 'data', 'attribute-groups.json');
  try {
    const buf = fs.readFileSync(file, 'utf8');
    return JSON.parse(buf);
  } catch (_) {
    try {
      // Fallback to require when running in different envs (e.g., Jest without fs mocks)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('../../../data/attribute-groups.json');
    } catch (e) {
      throw new Error('Failed to load attribute groups data');
    }
  }
}

function flattenGroup(group) {
  const id = group.id || group.code || safeSlugify(group.name);
  const name = group.name || id || 'Group';
  const attributes = Array.isArray(group.attributes) ? group.attributes : [];
  const flat = attributes.map((attr, idx) => ({
    // Preserve common attribute fields
    ...attr,
    code: attr.code || attr.id || `attr_${idx}`,
    name: attr.name || attr.label || attr.code || `Attribute ${idx + 1}`,
    groupId: id,
    groupName: name,
  }));
  return { id, name, attributes: flat, count: flat.length };
}

export default function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const groupsSrc = loadGroupsFromDisk();
    const groupsArray = Array.isArray(groupsSrc) ? groupsSrc : (Array.isArray(groupsSrc.groups) ? groupsSrc.groups : []);

    const grouped = groupsArray.map(flattenGroup);
    const total = grouped.reduce((sum, g) => sum + (g.count || 0), 0);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ count: total, groups: grouped });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/attribute-groups/grouped:', err);
    return res.status(500).json({ error: 'Failed to build grouped attributes' });
  }
}
