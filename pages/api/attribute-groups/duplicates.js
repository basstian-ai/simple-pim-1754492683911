import fs from 'fs';
import path from 'path';

function loadGroupsFromDisk() {
  const file = path.join(process.cwd(), 'data', 'attribute-groups.json');
  try {
    const buf = fs.readFileSync(file, 'utf8');
    return JSON.parse(buf);
  } catch (_) {
    try {
      // Jest/Node fallback
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require('../../../data/attribute-groups.json');
    } catch (e) {
      throw new Error('Failed to load attribute groups data');
    }
  }
}

function toArrayGroups(src) {
  if (Array.isArray(src)) return src;
  if (src && Array.isArray(src.groups)) return src.groups;
  return [];
}

function buildDuplicatesByCode(groups, min = 2) {
  const map = new Map();
  for (const g of groups) {
    const gid = g.id || g.code || (g.name ? g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'group');
    const gname = g.name || gid;
    const attrs = Array.isArray(g.attributes) ? g.attributes : [];
    for (const a of attrs) {
      const code = a && (a.code || a.id);
      if (!code) continue;
      if (!map.has(code)) map.set(code, []);
      map.get(code).push({ groupId: gid, groupName: gname, attributeName: a.name || a.label || code });
    }
  }

  const byCode = [];
  for (const [code, occ] of map.entries()) {
    if (occ.length >= min) {
      const groupsSet = new Map();
      for (const o of occ) {
        const key = o.groupId;
        if (!groupsSet.has(key)) groupsSet.set(key, { id: o.groupId, name: o.groupName, count: 0 });
        groupsSet.get(key).count += 1;
      }
      byCode.push({ code, total: occ.length, groups: Array.from(groupsSet.values()) });
    }
  }

  byCode.sort((a, b) => b.total - a.total || a.code.localeCompare(b.code));
  return { count: byCode.length, byCode };
}

export default function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const src = loadGroupsFromDisk();
    const groups = toArrayGroups(src);
    const min = Math.max(2, parseInt(String(req.query.min || '2'), 10) || 2);
    const report = buildDuplicatesByCode(groups, min);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(report);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/attribute-groups/duplicates:', err);
    return res.status(500).json({ error: 'Failed to analyze duplicates' });
  }
}

export { buildDuplicatesByCode };