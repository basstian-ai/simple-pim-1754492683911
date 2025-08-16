#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.env.ROOT_DIR ? path.resolve(process.env.ROOT_DIR) : process.cwd();

const pairs = [
  // pair: older/alternate path vs chosen canonical path
  { alt: 'server', canonical: 'src/server' },
  { alt: 'src/routes', canonical: 'src/server/routes' }
];

function exists(p) {
  try {
    return fs.existsSync(path.join(root, p));
  } catch (err) {
    return false;
  }
}

function plural(n) { return n === 1 ? '' : 's'; }

(async function main() {
  const conflicts = [];

  for (const { alt, canonical } of pairs) {
    const a = exists(alt);
    const b = exists(canonical);
    if (a && b) conflicts.push({ alt, canonical });
  }

  if (conflicts.length === 0) {
    console.log('OK: No duplicate server/route paths found.');
    process.exit(0);
  }

  console.error('Duplicate server/route path(s) detected:');
  for (const c of conflicts) {
    console.error(`  - Both "${c.alt}" and "${c.canonical}" exist.`);
    console.error(`    Recommended: choose "${c.canonical}" as the canonical location and merge/remove "${c.alt}".`);
  }

  console.error('\nSuggested next steps:');
  console.error('  1) Decide canonical layout (recommended: src/server and src/server/routes).');
  console.error('  2) Move code from the alternate path into the canonical path, update imports.');
  console.error('  3) Add a migration commit removing the alternate directories.');
  console.error('  4) Re-run this check; it will fail until alternates are removed to prevent future regressions.');

  // Provide a hint for CI usage
  console.error('\nTip: run with ROOT_DIR=/path/to/repo node tools/check-duplicate-paths.js');

  process.exit(1);
})();
