#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Pairs of directories that must not both exist. If both exist it's a likely duplicate/merge problem.
const pairs = [
  { a: 'server', b: 'src/server' },
  { a: 'routes', b: 'src/routes' },
  { a: 'src/routes', b: 'src/server/routes' }
];

function exists(p) {
  try {
    return fs.existsSync(path.resolve(process.cwd(), p));
  } catch (err) {
    return false;
  }
}

const conflicts = [];
for (const { a, b } of pairs) {
  if (exists(a) && exists(b)) {
    conflicts.push({ a, b });
  }
}

if (conflicts.length > 0) {
  console.error('\nDuplicate server/route directories detected.');
  console.error('Please consolidate to the canonical layout: `src/server` (and `src/server/routes`).\n');
  console.error('Conflicting directory pairs found:');
  for (const c of conflicts) {
    console.error(` - ${c.a}  <->  ${c.b}`);
  }
  console.error('\nMigration guidance: see docs/server-layout.md for recommended commands and import guidance.');
  process.exit(1);
}

console.log('OK — no duplicate server/route directories detected.');
