// scripts/check-server-layout.js
// Exit non-zero if duplicate server/route directory layouts are present.
// Intended as a lightweight CI guard to prevent regressions while consolidating
// server code to a single canonical location (see docs/CONTRIBUTING-SERVER-LAYOUT.md).

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(path.resolve(process.cwd(), p));
  } catch (e) {
    return false;
  }
}

const pairsToCheck = [
  // top-level vs src/
  ['server', 'src/server'],
  ['routes', 'src/server/routes'],
  ['routes', 'src/routes'],
  // older layouts
  ['src/server', 'server'],
  ['src/server/routes', 'src/routes']
];

const duplicates = [];
for (const [a, b] of pairsToCheck) {
  if (exists(a) && exists(b)) {
    duplicates.push([a, b]);
  }
}

if (duplicates.length === 0) {
  console.log('check-server-layout: OK — no duplicate server/route directories detected.');
  process.exit(0);
}

console.error('check-server-layout: ERROR — duplicate server/route directories detected.\n');
for (const [a, b] of duplicates) {
  console.error(`  - Both "${a}" and "${b}" exist`);
}

console.error('\nThis repository enforces a single canonical server layout to avoid import ambiguity, duplicate
compilation targets, and developer confusion. See docs/CONTRIBUTING-SERVER-LAYOUT.md for the canonical
layout and migration guidance.');

console.error('\nSuggested immediate actions:');
console.error('  1) Choose the canonical layout (recommended: src/server + src/server/routes).');
console.error('  2) Move or merge files from the non-canonical path into the canonical path.');
console.error('  3) Update imports and any build scripts, then commit the changes.');
console.error('  4) Re-run this check locally: node scripts/check-server-layout.js');

// Exit non-zero so CI fails and the team is alerted to consolidate before merging.
process.exit(2);
