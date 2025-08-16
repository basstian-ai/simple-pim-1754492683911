#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const root = process.cwd();

const checks = [
  // canonical choice: prefer `src/server`
  {a: 'server', b: 'src/server'},
  {a: 'src/routes', b: 'src/server/routes'},
  {a: 'server/routes', b: 'src/server/routes'}
];

const collisions = [];

for (const {a, b} of checks) {
  const pa = path.join(root, a);
  const pb = path.join(root, b);
  if (fs.existsSync(pa) && fs.existsSync(pb)) {
    collisions.push({a, b});
  }
}

if (collisions.length === 0) {
  console.log('OK: no duplicate server/route directories detected.');
  process.exit(0);
}

console.error('ERROR: duplicate server/route directories detected.');
console.error('Please consolidate to a single canonical layout. This project uses `src/server` as the canonical server location.');
console.error('Collisions found:');
for (const c of collisions) {
  console.error(` - both "${c.a}" and "${c.b}" exist`);
}

console.error('\nSuggested safe manual migration steps:');
console.error('  1) Review differences and commit or stash local changes.');
console.error('  2) Copy any missing files into src/server (the canonical location). Example:');
console.error('       rsync -av --exclude node_modules --exclude ".git" "./server/" "./src/server/"');
console.error('     or for routes:');
console.error('       rsync -av "./server/routes/" "./src/server/routes/"');
console.error('  3) Update imports that reference the old paths (search for `require("../server` or `from "server/"`).');
console.error('     If you use TypeScript path mappings, add or update `tsconfig.json` `paths` to map `server/*` -> `src/server/*` temporarily.');
console.error('  4) Remove the duplicate directory once everything is consolidated and tests pass:');
console.error('       git rm -r server || rm -rf server');
console.error('       git rm -r src/server/routes (if you consolidated into server)  # careful');
console.error('\nCI note: a workflow will run this script to prevent new duplicates from being introduced.\n');

process.exit(2);
