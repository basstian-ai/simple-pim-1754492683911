#!/usr/bin/env node

// Simple layout guard to detect duplicate/ambiguous server and routes directories.
// Fails with exit code 1 if a problematic duplicate is found.

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(path.resolve(p));
  } catch (e) {
    return false;
  }
}

const checks = [
  { a: 'server', b: 'src/server', reason: 'duplicate top-level server/ and src/server/' },
  { a: 'routes', b: 'src/server/routes', reason: 'duplicate routes/ and src/server/routes' },
  { a: 'src/routes', b: 'src/server/routes', reason: 'duplicate src/routes and src/server/routes' },
  { a: 'server/routes', b: 'src/server/routes', reason: 'duplicate server/routes and src/server/routes' }
];

const problems = [];
for (const c of checks) {
  if (exists(c.a) && exists(c.b)) {
    problems.push(c);
  }
}

if (problems.length === 0) {
  console.log('OK: server layout check passed. No duplicate server/routes directories found.');
  process.exit(0);
}

console.error('\nERROR: Repository contains duplicate server/routes directories:');
for (const p of problems) {
  console.error(`- ${p.a} and ${p.b} -> ${p.reason}`);
}

console.error('\nWhy this is a problem: running two different server trees can cause subtle runtime and test inconsistencies, and makes imports ambiguous.');
console.error('\nSuggested remediation:');
console.error('- Pick the canonical tree: we recommend src/server/.');
console.error('- Move the legacy files into the canonical tree (example):\n    git mv server src/server');
console.error('- Update imports that referenced the legacy path (search/replace or update tsconfig path aliases).');
console.error('- Ensure you run tests and the dev server locally before pushing.');
console.error('\nIf you intentionally keep both trees, add an explanatory note to docs/architecture/server-layout.md and update this check accordingly.');

process.exit(1);
