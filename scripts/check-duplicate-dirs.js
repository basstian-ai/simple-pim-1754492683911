#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const join = p => path.join(root, p);
const exists = p => fs.existsSync(join(p));

const checks = [];

// Primary duplication patterns we want to detect
checks.push({
  cond: exists('server') && exists('src/server'),
  msg: "Both 'server/' and 'src/server/' exist — choose a single canonical location for server code. Recommended: 'src/server/'."
});

checks.push({
  cond: exists('routes') && exists('src/routes'),
  msg: "Both 'routes/' and 'src/routes/' exist — choose a single canonical location for route modules. Recommended: 'src/routes/'."
});

checks.push({
  cond: exists('src/server/routes') && exists('src/routes'),
  msg: "Both 'src/server/routes/' and 'src/routes/' exist — consolidate route files under one directory (recommended: 'src/server/routes/')."
});

checks.push({
  cond: exists('server/routes') && exists('src/server/routes'),
  msg: "Both 'server/routes/' and 'src/server/routes/' exist — consolidate route files under one directory (recommended: 'src/server/routes/')."
});

// Additional helpful hints: detect common leftovers
checks.push({
  cond: exists('server') && !exists('src/server') && exists('src'),
  msg: "A top-level 'server/' exists while other code is under 'src/'. Consider moving server/ into 'src/server/' to keep source roots consistent."
});

const violations = checks.filter(c => c.cond).map(c => c.msg);

if (violations.length === 0) {
  console.log('OK — no duplicate server/route directories detected.');
  process.exit(0);
}

console.error('ERROR: Duplicate server/route directories detected.');
violations.forEach((v, i) => {
  console.error(`${i + 1}. ${v}`);
});

console.error('\nSuggested remediation steps:');
console.error("  1) Pick the canonical layout (recommended: 'src/server/' as the single server root and 'src/server/routes/' for routes).\n  2) Move files from the deprecated path into the canonical path (git mv preserves history).\n  3) Update imports that reference old relative paths (search for require/import patterns like from '../server' or '../../server').\n  4) Run the test suite / start app to verify behavior.\n");

// Exit non-zero so CI fails and forces authors to explicitly fix duplication.
process.exit(2);
