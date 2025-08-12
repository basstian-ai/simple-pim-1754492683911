// Lightweight ping endpoint for uptime probes and quick checks.
// Returns a tiny JSON payload and short edge caching headers to reduce load.
export default function handler(req, res) {
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.setHeader('Allow', 'GET,OPTIONS');
    res.status(204).end();
    return;
  }

  if (method !== 'GET') {
    res.setHeader('Allow', 'GET,OPTIONS');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Short edge cache to avoid hammering serverless functions from frequent probes.
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  res.status(200).json({
    ok: true,
    now: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
  });
}

