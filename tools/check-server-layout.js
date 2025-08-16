#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

// This script detects common duplicate server/route directory layouts and
// fails if both variants exist. The project should consolidate to a single
// canonical layout (recommended: src/server).

const cwd = process.cwd();
const pairs = [
  {
    name: 'server vs src/server',
    a: path.join(cwd, 'server'),
    b: path.join(cwd, 'src', 'server')
  },
  {
    name: 'src/routes vs src/server/routes',
    a: path.join(cwd, 'src', 'routes'),
    b: path.join(cwd, 'src', 'server', 'routes')
  }
];

const problems = [];
for (const p of pairs) {
  try {
    const aExists = fs.existsSync(p.a) && fs.statSync(p.a).isDirectory();
    const bExists = fs.existsSync(p.b) && fs.statSync(p.b).isDirectory();
    if (aExists && bExists) {
      problems.push({ name: p.name, a: p.a, b: p.b });
    }
  } catch (err) {
    // Ignore permission errors but report if something odd happens
    console.error('Warning while probing', p.name, err && err.message);
  }
}

if (problems.length > 0) {
  console.error('\nERROR: Duplicate server/route directories detected.');
  console.error('Please consolidate to a single canonical path (recommended: src/server).');
  console.error('See docs/server-layout.md for migration guidance.');
  console.error('Detected conflicts:');
  for (const pr of problems) {
    console.error(`- ${pr.name}: ${pr.a}  AND  ${pr.b}`);
  }
  // Exit with non-zero to fail CI (use a distinct code so callers can differentiate)
  process.exit(2);
} else {
  console.log('OK: No duplicate server/route directories detected.');
  process.exit(0);
}
