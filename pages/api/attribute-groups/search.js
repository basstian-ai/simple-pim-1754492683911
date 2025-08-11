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

function slugifyId(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'group';
}

function flattenAttributes(groups) {
  const out = [];
  for (const g of groups) {
    const groupId = g.id || g.code || slugifyId(g.name);
    const groupName = g.name || groupId;
    const attrs = Array.isArray(g.attributes) ? g.attributes : [];
    for (const a of attrs) {
      if (!a) continue;
      const code = a.code || a.id || null;
      if (!code) continue;
      out.push({
        code,
        label: a.label || a.name || code,
        type: a.type || 'text',
        required: Boolean(a.required),
        unit: a.unit || null,
        options: Array.isArray(a.options) ? a.options : [],
        groupId,
        groupName,
      });
    }
  }
  return out;
}

export default function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const src = loadGroupsFromDisk();
    const groups = toArrayGroups(src);
    const flat = flattenAttributes(groups);

    const q = String(req.query.q || '').trim().toLowerCase();
    const type = req.query.type ? String(req.query.type).trim().toLowerCase() : '';
    const groupIdFilter = req.query.groupId ? String(req.query.groupId).trim() : '';
    const requiredParam = req.query.required;
    const hasRequiredFilter = typeof requiredParam !== 'undefined';
    const requiredFilter = hasRequiredFilter ? ['1', 'true', 'yes'].includes(String(requiredParam).toLowerCase()) : null;

    let results = flat;

    if (q) {
      results = results.filter((r) =>
        r.code.toLowerCase().includes(q) ||
        (r.label && String(r.label).toLowerCase().includes(q)) ||
        (r.groupName && String(r.groupName).toLowerCase().includes(q))
      );
    }

    if (type) {
      results = results.filter((r) => String(r.type || '').toLowerCase() === type);
    }

    if (groupIdFilter) {
      results = results.filter((r) => r.groupId === groupIdFilter);
    }

    if (hasRequiredFilter) {
      results = results.filter((r) => r.required === requiredFilter);
    }

    const total = results.length;

    // Simple pagination support
    const limit = Math.max(1, Math.min(500, parseInt(String(req.query.limit || '100'), 10) || 100));
    const offset = Math.max(0, parseInt(String(req.query.offset || '0'), 10) || 0);
    const paged = results.slice(offset, offset + limit);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      count: total,
      attributes: paged,
      query: {
        q,
        type: type || null,
        groupId: groupIdFilter || null,
        required: hasRequiredFilter ? requiredFilter : null,
        limit,
        offset,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/attribute-groups/search:', err);
    return res.status(500).json({ error: 'Failed to search attribute groups' });
  }
}
