// scripts/check-duplicate-servers.js
// Detects duplicate server/route directories (e.g. `server` vs `src/server`, `src/routes` vs `src/server/routes`).
// Exits with non-zero code when duplicates are found to block CI.

const fs = require('fs');
const path = require('path');

function exists(rel) {
  return fs.existsSync(path.join(process.cwd(), rel));
}

function walk(dir) {
  const root = path.join(process.cwd(), dir);
  const out = [];
  if (!fs.existsSync(root)) return out;
  (function _walk(current, base) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const rel = path.join(base, e.name);
      if (e.isDirectory()) {
        _walk(path.join(current, e.name), rel);
      } else {
        out.push(rel.replace(/\\\\/g, '/'));
      }
    }
  })(root, '');
  return out;
}

function printHeading(msg) {
  console.log('==============================');
  console.log(msg);
  console.log('==============================');
}

(function main() {
  // Preferred canonical directory can be overridden by env var
  const canonical = (process.env.CANONICAL_DIR || 'src/server').replace(/\\\\$/,'');

  // Pairs to check: if both paths exist, that's suspicious
  const pairs = [
    ['server', 'src/server'],
    ['routes', 'src/routes'],
    ['src/routes', 'src/server/routes'],
    ['server/routes', 'src/server/routes'],
  ];

  const found = [];

  for (const [a, b] of pairs) {
    if (exists(a) && exists(b)) {
      const aFiles = walk(a);
      const bFiles = walk(b);

      // compute intersections by normalized relative path
      const aSet = new Set(aFiles.map(p => p.replace(/^\/+/, '')));
      const bSet = new Set(bFiles.map(p => p.replace(/^\/+/, '')));

      const overlap = [];
      for (const p of aSet) {
        if (bSet.has(p)) overlap.push(p);
      }

      found.push({ a, b, overlap, aCount: aFiles.length, bCount: bFiles.length });
    }
  }

  if (found.length === 0) {
    console.log('No duplicate server/routes directories detected.');
    process.exit(0);
  }

  printHeading('Duplicate server/route directories detected');
  console.error('Repository contains multiple candidate server/route locations. This can lead to ambiguity and regressions.');
  console.error('By default the canonical location is:', canonical);
  console.error('If your project intentionally uses a different layout, set CANONICAL_DIR to the preferred path.');
  console.error('See docs/server-layout.md for migration guidance.');

  for (const item of found) {
    console.error('');
    console.error(`Conflict: "${item.a}" <=> "${item.b}"`);
    console.error(`  ${item.a}: ${item.aCount} files`);
    console.error(`  ${item.b}: ${item.bCount} files`);
    if (item.overlap.length > 0) {
      console.error('  Overlapping relative paths (likely duplicates):');
      for (const o of item.overlap.slice(0, 50)) {
        console.error('    -', o);
      }
      if (item.overlap.length > 50) console.error('    ... (truncated)');
    } else {
      console.error('  No direct file-relative-path overlap found, but parallel directories exist which may cause confusion.');
    }

    // example remediation hint
    console.error('  Suggested remediation: pick a single canonical server dir (recommended:', canonical + '), move files there, update imports, and remove the duplicate directory.');
  }

  console.error('');
  console.error('To bypass this check temporarily in CI, set CANONICAL_DIR to your preferred path, e.g.');
  console.error('  CANONICAL_DIR=server node scripts/check-duplicate-servers.js');
  console.error('');
  process.exit(1);
})();
