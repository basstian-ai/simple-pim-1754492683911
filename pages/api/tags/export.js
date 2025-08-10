export default function handler(req, res) {
  try {
    // Load products data directly; API is read-only export
    const products = require('../../../data/products.json');

    const allTags = Array.from(
      new Set(
        [].concat(
          ...products.map((p) =>
            Array.isArray(p?.tags)
              ? p.tags
                  .filter((t) => typeof t === 'string')
                  .map((t) => t.trim())
                  .filter(Boolean)
              : []
          )
        )
      )
    ).sort((a, b) => a.localeCompare(b));

    const csvEscape = (value) => {
      const s = String(value);
      if (/[",\n]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const header = 'tag';
    const rows = allTags.map(csvEscape).join('\n');
    const csv = header + '\n' + rows + (rows ? '\n' : '');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="tags.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    console.error('Failed to export tags CSV', err);
    return res.status(500).json({ error: 'Failed to export tags' });
  }
}
