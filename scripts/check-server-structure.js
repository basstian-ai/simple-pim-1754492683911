'use strict';

const fs = require('fs');
const path = require('path');

// Root can be overridden for tests via CHECK_ROOT
const ROOT = process.env.CHECK_ROOT ? path.resolve(process.env.CHECK_ROOT) : process.cwd();

const pairs = [
  // canonical chosen: src/server
  ['server', 'src/server'],
  // routes may live at top-level 'routes' or under 'src' or under 'src/server'
  ['routes', 'src/server/routes'],
  ['src/routes', 'src/server/routes']
];

function exists(p) {
  try {
    return fs.existsSync(path.join(ROOT, p));
  } catch (e) {
    return false;
  }
}

let duplicates = [];
for (const [a, b] of pairs) {
  if (exists(a) && exists(b)) {
    duplicates.push({a, b});
  }
}

if (duplicates.length === 0) {
  console.log('OK: no duplicate server/route directories detected');
  process.exit(0);
}

console.error('ERROR: duplicate server/route directory layout detected');
console.error('Found the following overlapping paths:');
for (const d of duplicates) {
  console.error(` - ${d.a}  <-->  ${d.b}`);
}

console.error('\nThis repository enforces a single canonical server layout (src/server).');
console.error('Please consolidate duplicate paths by moving code into src/server and removing the duplicate directories.');
console.error('Helpful steps:');
console.error('  1) Move files from the non-canonical path into src/server (preserve history with git mv when possible).');
console.error('  2) Update imports/require paths to point to the new locations (search for references to the old path).');
console.error('  3) Run tests and linting, and ensure CI passes.');
console.error('\nSee docs/server-structure.md for migration guidance.');

// Non-zero exit to fail CI
process.exit(2);
