// validate-server-layout.js
// Fails (non-zero exit) when duplicate server/route directories are detected.
// Intended to be run by CI to prevent regressions while the repo is consolidated.

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(path.resolve(process.cwd(), p));
  } catch (e) {
    return false;
  }
}

const SIMULATE_DUPLICATES = process.env.SIMULATE_DUPLICATES === '1';
const IGNORE_CHECK = process.env.LINT_IGNORE_SERVER_LAYOUT === '1' || process.env.IGNORE_SERVER_LAYOUT_CHECK === '1';

if (IGNORE_CHECK) {
  console.log('validate-server-layout: check skipped via IGNORE_SERVER_LAYOUT_CHECK / LINT_IGNORE_SERVER_LAYOUT');
  process.exit(0);
}

// canonical layout choice (documented elsewhere). Default: src/server
const CANONICAL = process.env.CANONICAL_SERVER_PATH || 'src/server';

const duplicatePairs = [
  { a: 'server', b: 'src/server' },
  { a: 'src/routes', b: 'src/server/routes' }
];

const problems = [];

if (SIMULATE_DUPLICATES) {
  // For test harnesses: simulate that duplicates were found
  duplicatePairs.forEach(p => {
    problems.push({ pair: `${p.a} + ${p.b}`, reason: 'simulated duplicates (SIMULATE_DUPLICATES=1)' });
  });
} else {
  duplicatePairs.forEach(p => {
    if (exists(p.a) && exists(p.b)) {
      problems.push({ pair: `${p.a} + ${p.b}`, reason: 'both paths exist' });
    }
  });
}

if (problems.length === 0) {
  console.log(`validate-server-layout: OK — no duplicate server/route directories detected. Canonical path: ${CANONICAL}`);
  process.exit(0);
}

console.error('ERROR: duplicate server/route directories detected.');
console.error('This repository enforces a single canonical server source tree to avoid ambiguity (see docs/server-layout.md).');
console.error('Detected conflicts:');
problems.forEach(p => console.error(` - ${p.pair}: ${p.reason}`));

console.error('\nSuggested remediation (pick the canonical location and remove/merge the other):');
console.error(` - Preferred (recommended): move files from the non-canonical path into ${CANONICAL} using git mv, then update imports.`);
console.error('   Example:');
console.error(`     git mv server/**/* ${CANONICAL}/`);
console.error('   or (if deleting):');
console.error('     git rm -r server && git commit -m "remove legacy server/ directory; use src/server"');
console.error('\nQuick helpers to find imports that reference the deprecated path:');
console.error(' - grep -R "from \"../server" . || true');
console.error(' - git grep "require(\"../server" || true');

console.error('\nIf you need a temporary bypass for an urgent change, set IGNORE_SERVER_LAYOUT_CHECK=1 in CI, but open a follow-up PR to resolve the layout.');

process.exit(2);
