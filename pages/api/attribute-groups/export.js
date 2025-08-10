export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const groups = require('../../../data/attribute-groups.json');

  const headers = ['id', 'name', 'attributesCount', 'attributes'];

  const rows = Array.isArray(groups)
    ? groups.map((g) => ({
        id: g.id != null ? String(g.id) : g.slug != null ? String(g.slug) : String(g.name || ''),
        name: g.name != null ? String(g.name) : String(g.title || ''),
        attributesCount: Array.isArray(g.attributes)
          ? g.attributes.length
          : Array.isArray(g.items)
          ? g.items.length
          : 0,
        attributes: Array.isArray(g.attributes)
          ? g.attributes.map(String).join('|')
          : Array.isArray(g.items)
          ? g.items.map(String).join('|')
          : '',
      }))
    : [];

  const csvEscape = (val) => {
    if (val === null || val === undefined) return '';
    const s = String(val);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };

  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(',')),
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="attribute-groups.csv"');
  return res.status(200).send(csv);
}
