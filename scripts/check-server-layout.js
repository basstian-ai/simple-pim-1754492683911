#!/usr/bin/env node
// scripts/check-server-layout.js
// Fail-fast CI check to detect duplicate server/route directories that cause maintenance burden.
// Usage: node scripts/check-server-layout.js

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(path.resolve(process.cwd(), p));
  } catch (e) {
    return false;
  }
}

// Allow skipping the check in special circumstances (CI can override)
if (process.env.SKIP_SERVER_LAYOUT_CHECK === '1') {
  console.log('Skipping server layout check (SKIP_SERVER_LAYOUT_CHECK=1)');
  process.exit(0);
}

const candidates = [
  { a: 'server', b: 'src/server', recommended: 'src/server' },
  { a: 'src/routes', b: 'src/server/routes', recommended: 'src/server/routes' },
  { a: 'routes', b: 'src/server/routes', recommended: 'src/server/routes' }
];

const duplicates = [];

for (const { a, b, recommended } of candidates) {
  if (exists(a) && exists(b)) duplicates.push({ a, b, recommended });
}

if (duplicates.length === 0) {
  console.log('OK: no duplicate server/route directory pairs detected.');
  process.exit(0);
}

console.error('ERROR: Duplicate server/route directories detected.');
console.error('This repository appears to contain multiple location(s) for server code which can cause import ambiguity and maintenance drift.');
console.error('Please consolidate to a single canonical location (recommended: "src/server").');
console.error('\nDetected duplicates:');
for (const d of duplicates) {
  console.error(`  - ${d.a}  <-->  ${d.b}   (recommend consolidating into: ${d.recommended})`);
}

console.error('\nSuggested remediation steps (example):');
console.error('  1) Choose a canonical location (e.g. src/server).');
console.error('  2) Move files from the other location into the canonical path:');
console.error("       git mv server/* src/server/ || rsync -a server/ src/server/ && git add -A && git commit -m 'move server to src/server' ");
console.error('  3) Update imports that referenced the old path (search & replace).');
console.error('  4) Run tests and lint.');
console.error('\nIf you intentionally maintain two layouts (not recommended), you can bypass this check by setting SKIP_SERVER_LAYOUT_CHECK=1 in CI.');

process.exit(2);
