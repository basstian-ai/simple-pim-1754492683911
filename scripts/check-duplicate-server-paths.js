'use strict';

const path = require('path');
const { findDuplicateServerPaths } = require('./lib/checkPaths');

function main() {
  const root = process.cwd();
  const issues = findDuplicateServerPaths(root);

  if (issues.length === 0) {
    console.log('OK: No duplicate server/route directories detected. Canonical layout is "src/server" / "src/server/routes".');
    process.exit(0);
  }

  console.error('ERROR: Duplicate server/route directory layout detected.');
  for (const msg of issues) console.error('- ' + msg);

  console.error('\nSuggested actions:');
  console.error('- Consolidate code into the canonical path: "src/server" (and "src/server/routes").');
  console.error('- Replace old imports that reference the non-canonical path.');
  console.error('- Add a small index re-export temporarily if you need a compatibility shim during migration.');
  process.exit(1);
}

if (require.main === module) main();
