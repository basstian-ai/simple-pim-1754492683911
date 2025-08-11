export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Load products directly from data source
    const products = require('../../../data/products.json');
    const counts = {};

    for (const p of products) {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      for (const tag of tags) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }

    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([tag, count]) => ({ tag, count }));

    res.status(200).json({ counts, top });
  } catch (e) {
    res.status(500).json({ error: 'Failed to compute tag stats' });
  }
}
