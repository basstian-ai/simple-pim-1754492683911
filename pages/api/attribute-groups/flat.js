export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Load groups from static data (can be replaced by a persistent store later)
    const groups = require('../../../data/attribute-groups.json');

    const { q, type, groupId } = req.query || {};

    const attributes = [];
    for (const g of Array.isArray(groups) ? groups : []) {
      if (groupId && String(g.id) !== String(groupId)) continue;
      const list = Array.isArray(g.attributes) ? g.attributes : [];
      for (const attr of list) {
        const item = {
          ...attr,
          groupId: g.id,
          groupName: g.name,
        };
        attributes.push(item);
      }
    }

    // Optional filtering by query and type
    const filtered = attributes.filter((a) => {
      if (type && String(a.type) !== String(type)) return false;
      if (q) {
        const ql = String(q).toLowerCase();
        const hay = [a.code, a.label, a.name, a.groupName].filter(Boolean).map((s) => String(s).toLowerCase());
        if (!hay.some((h) => h.includes(ql))) return false;
      }
      return true;
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ count: filtered.length, attributes: filtered });
  } catch (err) {
    console.error('Attribute groups flat handler error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
