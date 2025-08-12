// verify the API and data availability from monitoring systems or deploy checks.
export default function handler(req, res) {
  // Ensure JSON responses
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  } catch (_) {}

  // Allow simple CORS for probes and local tooling
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (_) {}

  if (req.method === 'OPTIONS') {
    // preflight
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET,OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Short edge cache so frequent probes do not hit origin repeatedly.
  try {
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
  } catch (_) {}

  // Best-effort version from package.json
  let version = null;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const pkg = require(process.cwd() + '/package.json');
    if (pkg && pkg.version) version = String(pkg.version);
  } catch (_) {
    // ignore
  }

  // Product count: read static data fallback (fast & deterministic)
  let productCount = null;
  try {
    // Try to load structured products via the data file (fast and safe in serverless)
    // Path is relative to this file: pages/api -> ../../data
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const products = require('../../data/products.json');
    if (Array.isArray(products)) productCount = products.length;
    else if (products && Array.isArray(products.products)) productCount = products.products.length;
  } catch (_) {
    // ignore; productCount stays null
  }

  return res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptimeSeconds: typeof process !== 'undefined' && process.uptime ? Math.floor(process.uptime()) : null,
    version,
    productCount,
  });
}

