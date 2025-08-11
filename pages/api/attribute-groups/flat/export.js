'use strict';

function flattenAttributeGroups(groups) {
  const out = [];
  if (!Array.isArray(groups)) return out;
  for (const g of groups) {
    const list = Array.isArray(g.attributes) ? g.attributes : [];
    for (const attr of list) {
      const name = attr.label || attr.name || attr.code || '';
      out.push({
        groupId: g.id || '',
        groupName: g.name || '',
        code: attr.code || '',
        name,
        type: attr.type || '',
        required: Boolean(attr.required),
        unit: attr.unit || '',
        options: Array.isArray(attr.options) ? attr.options.join('|') : ''
      });
    }
  }
  return out;
}

function toCsv(rows) {
  const headers = ['groupId', 'groupName', 'code', 'name', 'type', 'required', 'unit', 'options'];
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(','));
  }
  return lines.join('\n');
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const groups = require('../../../../data/attribute-groups.json');
    const flattened = flattenAttributeGroups(groups);
    const csv = toCsv(flattened);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="attribute-groups-flat.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('flat attributes export error', err);
    return res.status(500).json({ error: 'Failed to export flat attributes' });
  }
};

module.exports._internal = { flattenAttributeGroups, toCsv };