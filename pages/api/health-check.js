// Lightweight health-check endpoint.
// Returns basic process uptime, timestamp and package version (if available).
// Includes permissive CORS and short caching for edge/CDN.
export default function handler(req, res) {
  // Ensure JSON responses
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  } catch (_) {}

  // Permissive CORS for tooling & local development
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (_) {}

  if (req.method === 'OPTIONS') {
    // Preflight: no body
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET,OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Short edge cache to let CDNs serve the health-check without hitting the origin too often.
  try {
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
  } catch (_) {}

  let version = null;
  try {
    // Use process.cwd() to reliably locate package.json regardless of module resolution.
    // This is best-effort; failure shouldn't make the endpoint fail.
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const pkg = require(process.cwd() + '/package.json');
    if (pkg && pkg.version) version = String(pkg.version);
  } catch (_) {}

  return res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptimeSeconds: typeof process !== 'undefined' && process.uptime ? Math.floor(process.uptime()) : null,
    version,
  });
}
