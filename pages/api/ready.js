// Lightweight readiness endpoint for deploy checks.
// - Validates presence and basic shape of data/products.json and data/attribute-groups.json
// - Returns 200 when checks pass, 503 if any check fails
// - Includes permissive CORS and short edge caching suitable for probes

export default function handler(req, res) {
  // Ensure JSON responses
  try { res.setHeader('Content-Type', 'application/json; charset=utf-8'); } catch (_) {}

  // Allow simple CORS for probes and tooling
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (_) {}

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    try { res.setHeader('Allow', 'GET,OPTIONS'); } catch (_) {}
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // Short edge cache so frequent probes do not hit origin repeatedly.
  try { res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10'); } catch (_) {}

  const result = { ok: true, timestamp: new Date().toISOString(), checks: {} };

  // Check products data
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const products = require(process.cwd() + '/data/products.json');
    const count = Array.isArray(products) ? products.length : (products && Array.isArray(products.products) ? products.products.length : null);
    result.checks.products = { ok: true, count };
  } catch (e) {
    result.checks.products = { ok: false, error: 'failed to load data/products.json' };
    result.ok = false;
  }

  // Check attribute groups data
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const groups = require(process.cwd() + '/data/attribute-groups.json');
    const count = Array.isArray(groups) ? groups.length : (groups && Array.isArray(groups.groups) ? groups.groups.length : null);
    result.checks.attributeGroups = { ok: true, count };
  } catch (e) {
    result.checks.attributeGroups = { ok: false, error: 'failed to load data/attribute-groups.json' };
    result.ok = false;
  }

  // Best-effort version from package.json
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const pkg = require(process.cwd() + '/package.json');
    if (pkg && pkg.version) result.version = String(pkg.version);
  } catch (_) {
    // ignore
  }

  return res.status(result.ok ? 200 : 503).json(result);
}
