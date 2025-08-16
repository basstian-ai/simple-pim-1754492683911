#!/usr/bin/env node
'use strict';

// Lightweight guard that fails CI if duplicate server/route directories exist
// Rules enforced:
//  - If both 'server' and 'src/server' exist -> error
//  - If both 'src/routes' and 'src/server/routes' exist -> error
//  - If both 'server/routes' and 'src/server/routes' exist -> error

const fs = require('fs');
const path = require('path');

function exists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

function check(root) {
  const issues = [];

  if (exists(root, 'server') && exists(root, 'src/server')) {
    issues.push("Both 'server' and 'src/server' exist. Choose a single canonical server location (recommended: src/server) and migrate one into the other.");
  }

  if (exists(root, 'src/routes') && exists(root, 'src/server/routes')) {
    issues.push("Both 'src/routes' and 'src/server/routes' exist. Consolidate route files under a single directory (recommended: src/server/routes).");
  }

  if (exists(root, 'server/routes') && exists(root, 'src/server/routes')) {
    issues.push("Both 'server/routes' and 'src/server/routes' exist. Consolidate route files under a single directory (recommended: src/server/routes).");
  }

  // additional heuristic: if top-level 'src/server' exists but there's also a top-level 'srcServer' (typo-ish), warn but don't fail
  if (exists(root, 'srcServer') && exists(root, 'src/server')) {
    issues.push("Found 'srcServer' alongside 'src/server' — possible accidental duplicate/typo. Consider removing or renaming.");
  }

  return issues;
}

function main() {
  const argv = process.argv.slice(2);
  let root = process.cwd();
  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === '--root' || argv[i] === '-r') && argv[i + 1]) {
      root = path.resolve(argv[i + 1]);
      i++;
    }
  }

  const issues = check(root);
  if (issues.length === 0) {
    console.log('OK: No duplicate server/route directories detected.');
    process.exitCode = 0;
    return;
  }

  console.error('ERROR: Detected duplicate server/route directories:');
  for (const it of issues) {
    console.error(' - ' + it);
  }

  console.error('\nRecommended remediation steps:');
  console.error(" 1) Pick a canonical layout (recommended: 'src/server' for server code and 'src/server/routes' for routes).\n 2) Move files from the non-canonical location into the canonical path, update imports that referenced the old path.\n 3) Remove the old directory.\n 4) Run this check locally (`node scripts/check-duplicate-servers.js`) to ensure the repository is clean.");

  process.exitCode = 1;
}

if (require.main === module) main();
