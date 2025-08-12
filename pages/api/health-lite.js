// - Returns minimal JSON useful for uptime probes / load balancers
// - Includes permissive CORS and short edge cache headers

export default function handler(req, res) {
  // Allow preflight for probes/tools
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (_) {}

  if (req.method === 'OPTIONS') {
    try { res.setHeader('Allow', 'GET,OPTIONS'); } catch (_) {}
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    try { res.setHeader('Allow', 'GET,OPTIONS'); } catch (_) {}
    try { res.setHeader('Content-Type', 'application/json; charset=utf-8'); } catch (_) {}
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // Short edge cache — health endpoints are read-heavy but should stay fresh
  try {
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
  } catch (_) {}

  // Best-effort package version (non-fatal if missing)
  let version = null;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const pkg = require(process.cwd() + '/package.json');
    if (pkg && pkg.version) version = String(pkg.version);
  } catch (_) {
    // ignore
  }

  const payload = {
    ok: true,
    timestamp: new Date().toISOString(),
    uptimeSeconds: typeof process !== 'undefined' && process.uptime ? Math.floor(process.uptime()) : null,
    version,
  };

  try { res.setHeader('Content-Type', 'application/json; charset=utf-8'); } catch (_) {}
  return res.status(200).json(payload);
}



