
#!/usr/bin/env node
// scripts/check-duplicate-server-paths.js
// Exit non-zero if duplicate server/route directories are present.
// This is a lightweight guard to prevent duplicate server source trees (e.g. server/ vs src/server/)

const fs = require('fs');
const path = require('path');

function exists(rel) {
  return fs.existsSync(path.resolve(process.cwd(), rel));
}

const checks = [
  { a: 'server', b: 'src/server' },
  { a: 'src/routes', b: 'src/server/routes' },
  { a: 'routes', b: 'src/routes' }
];

let problems = [];

for (const { a, b } of checks) {
  if (exists(a) && exists(b)) {
    problems.push({ a, b });
  }
}

if (problems.length === 0) {
  console.log('check-duplicate-server-paths: OK — no duplicate server/route directories detected.');
  process.exit(0);
}

console.error('\ncheck-duplicate-server-paths: ERROR — duplicate server/route directories detected.\n');
console.error('Found the following duplicate sets:');
for (const p of problems) {
  console.error(`  - Both "${p.a}" and "${p.b}" exist`);
}

console.error('\nWhy this matters:');
console.error('  Having multiple copies of server logic causes confusion, broken imports, and inconsistent behavior across environments.');

console.error('\nRecommended canonical layout:');
console.error('  Choose one canonical location for server code. The project CI expects "src/server" as the canonical path.');

console.error('\nMigration guidance:');
console.error('  1) Pick a canonical directory (prefer "src/server").');
console.error('  2) Move files from the non-canonical directory into the canonical one keeping relative structure.');
console.error('  3) Update imports: search for imports like "../server" or "../routes" and point them to the chosen path.');
console.error('  4) Run the tests and this check locally to verify there are no duplicates.');

console.error('\nIf you intentionally keep both during a staged migration, add a short-lived exception in .github/workflows/check-server-layout.yml or modify this script to allow your path combo.');

process.exit(1);
