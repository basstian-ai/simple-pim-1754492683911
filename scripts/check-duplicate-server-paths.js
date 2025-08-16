#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function exists(p) {
  try { return fs.statSync(p).isDirectory(); } catch (e) { return false; }
}

function findDuplicates(root) {
  // Candidate groups to detect overlapping/duplicate server+route directories
  const candidates = {
    server: [path.join(root, 'server'), path.join(root, 'src', 'server')],
    routes: [
      path.join(root, 'routes'),
      path.join(root, 'src', 'routes'),
      path.join(root, 'src', 'server', 'routes'),
      path.join(root, 'server', 'routes')
    ]
  };

  const found = {};
  for (const key of Object.keys(candidates)) {
    found[key] = candidates[key].filter(exists).map(p => path.relative(root, p) || p);
  }

  const duplicates = [];
  for (const k of Object.keys(found)) {
    if (found[k].length > 1) duplicates.push({ type: k, paths: found[k] });
  }
  return duplicates;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.includes('--test')) {
    runTests();
    process.exit(0);
  }

  const root = process.cwd();
  const dups = findDuplicates(root);
  if (dups.length === 0) {
    console.log('No duplicate server/route paths found.');
    process.exit(0);
  } else {
    console.error('\nERROR: Duplicate server/route directories detected:');
    for (const d of dups) {
      console.error(`- ${d.type}:`);
      for (const p of d.paths) console.error(`  - ${p}`);
    }
    console.error('\nRecommendation: choose a single canonical path for each type (recommended: src/server and src/server/routes) and move/merge code.');
    console.error('Run this check locally and in CI to prevent regressions.');
    process.exit(2);
  }
}

function runTests() {
  // Lightweight self-test using a temporary directory to ensure detection logic works.
  const os = require('os');
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dup-check-'));
  const serverA = path.join(tmpRoot, 'server');
  const serverB = path.join(tmpRoot, 'src', 'server');
  fs.mkdirSync(serverA, { recursive: true });
  fs.mkdirSync(serverB, { recursive: true });

  const res = findDuplicates(tmpRoot);
  if (!Array.isArray(res) || res.length === 0) {
    console.error('self-test failed: expected to find duplicates but found none');
    process.exit(3);
  }
  console.log('self-test passed: duplicate detection logic working');
}
