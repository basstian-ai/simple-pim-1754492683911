// Lightweight status endpoint providing version, uptime and commit info.
// Helpful for health checks, deploy verification and observability tooling.
export default function handler(req, res) {
  // Ensure JSON responses
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  } catch (_) {}

  // Allow simple CORS for tooling and probes
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

  // Short edge cache so probes don't hit origin too frequently
  try {
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
  } catch (_) {}

  let version = null;
  try {
    // Best-effort read of package.json from project root
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const pkg = require(process.cwd() + '/package.json');
    if (pkg && pkg.version) version = String(pkg.version);
  } catch (_) {
    // ignore
  }

  const commit = process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_SHA || null;

  const payload = {
    ok: true,
    timestamp: new Date().toISOString(),
    uptimeSeconds: typeof process !== 'undefined' && process.uptime ? Math.floor(process.uptime()) : null,
    version,
    commit,
    env: process.env.NODE_ENV || null,
  };

  return res.status(200).json(payload);
}

