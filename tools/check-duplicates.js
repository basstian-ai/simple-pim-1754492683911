// tools/check-duplicates.js
// Simple CI helper that fails when duplicate server/route directories exist.
// Purpose: prevent regressions where a second copy of server code (e.g. `server/` vs `src/server/`) drifts out of sync.

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
function isDir(p) {
  try {
    return fs.statSync(path.join(repoRoot, p)).isDirectory();
  } catch (e) {
    return false;
  }
}

// Pairs (or groups) we want to ensure are not duplicated simultaneously.
// If both entries in a pair/group exist, we treat that as a duplication/regression.
const duplicateChecks = [
  // canonical: src/server
  { group: ['server', 'src/server'], reason: 'duplicate root-level server code' },
  // routes duplication (several common layouts)
  { group: ['routes', 'src/routes'], reason: 'duplicate top-level routes folder' },
  { group: ['src/routes', 'src/server/routes'], reason: 'duplicate routes under src' },
  { group: ['routes', 'src/server/routes'], reason: 'routes folder exists both at project root and under src/server' },
  { group: ['server/routes', 'src/server/routes'], reason: 'duplicate nested routes folder for server' }
];

const problems = [];

for (const check of duplicateChecks) {
  const present = check.group.filter(isDir);
  if (present.length > 1) {
    problems.push({ group: check.group, present, reason: check.reason });
  }
}

if (problems.length === 0) {
  console.log('check-duplicates: no duplicate server/route directories detected.');
  process.exit(0);
}

console.error('\nERROR: repository contains duplicate server/route directory paths.');
console.error('This check enforces a single canonical layout (recommended: src/server + src/server/routes).');
console.error('\nDetected the following conflicting groups:');
for (const p of problems) {
  console.error('\n- ' + p.reason + ':');
  for (const dir of p.present) console.error('    • ' + dir);
}

console.error('\nGuidance:');
console.error(' - Choose a single canonical location for server code. We recommend: src/server (and nested src/server/routes).');
console.error(" - Move files (git mv) from the deprecated location into 'src/server' and update imports/path aliases accordingly.");
console.error(' - If you intentionally keep both (rare), update this tool or CI workflow to acknowledge the exception.');
console.error('\nQuick example to move a directory (run from repo root):');
console.error("  git mv server src/server || rsync -a server/ src/server/ && git add -A && git commit -m 'chore: migrate server -> src/server'\n");

console.error('The CI job failed to prevent accidental drift. Please consolidate the directories and push again.');
process.exit(2);
