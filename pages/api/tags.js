import { getAllTags } from '../../lib/tags';

export default function handler(req, res) {
  try {
    // Ensure we always respond with JSON and allow simple cross-origin tooling access.
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      // Preflight – no body
      res.setHeader('Allow', 'GET,OPTIONS');
      return res.status(204).end();
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET,OPTIONS');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Short edge cache so frequent tag list requests are cheap for CDN/edge.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    const q = (req.query && (req.query.search || req.query.q)) || '';
    const tags = getAllTags({ search: q });
    return res.status(200).json(tags);
  } catch (err) {
    // Keep the error minimal for clients but log server-side for diagnostics.
    // eslint-disable-next-line no-console
    console.error('Error in /api/tags:', err);
    try { res.setHeader('Content-Type', 'application/json; charset=utf-8'); } catch (_) {}
    return res.status(500).json({ error: 'Failed to load tags' });
  }
}
