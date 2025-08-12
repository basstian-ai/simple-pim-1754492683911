// Consolidated health hub endpoint
// Provides a single, machine-friendly health + readiness summary combining
// basic process metadata and lightweight data-file checks.
export default function handler(req, res) {
  // Allow simple CORS for probes and tooling
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (_) {}

  if (req.method === 'OPTIONS') {
    // Preflight – no body
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    try {
      res.setHeader('Allow', 'GET,OPTIONS');
    } catch (_) {}
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Short edge cache so frequent probes do not hit origin repeatedly.
  try {
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
  } catch (_) {}

  const now = new Date().toISOString();
  const uptimeSeconds =
    typeof process !== 'undefined' && process.uptime ? Math.floor(process.uptime()) : null;

  // Best-effort version/commit info
  let version = null;
  try {
    // Use process.cwd() so resolution is robust in different runtimes.
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const pkg = require(process.cwd() + '/package.json');
    if (pkg && pkg.version) version = String(pkg.version);
  } catch (_) {
    // ignore
  }

  const commit =
    process.env.VERCEL_GITHUB_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.COMMIT_SHA ||
    null;

  // Lightweight data-file checks (non-fatal). These mirror what readiness checks
  // expect: existence and basic shape of products.json and attribute-groups.json.
  const checks = {
    products: { ok: false, count: null, error: null },
    attributeGroups: { ok: false, count: null, error: null },
  };

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const products = require(process.cwd() + '/data/products.json');
    const count = Array.isArray(products)
      ? products.length
      : products && Array.isArray(products.products)
      ? products.products.length
      : null;
    checks.products.ok = count !== null;
    checks.products.count = count;
  } catch (e) {
    checks.products.ok = false;
    checks.products.error = 'failed to load data/products.json';
  }

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const groups = require(process.cwd() + '/data/attribute-groups.json');
    const count = Array.isArray(groups)
      ? groups.length
      : groups && Array.isArray(groups.groups)
      ? groups.groups.length
      : null;
    checks.attributeGroups.ok = count !== null;
    checks.attributeGroups.count = count;
  } catch (e) {
    checks.attributeGroups.ok = false;
    checks.attributeGroups.error = 'failed to load data/attribute-groups.json';
  }

  const ready = checks.products.ok && checks.attributeGroups.ok;

  const payload = {
    ok: true,
    timestamp: now,
    uptimeSeconds,
    version,
    commit,
    ready,
    checks,
  };

  return res.status(ready ? 200 : 503).json(payload);
}

