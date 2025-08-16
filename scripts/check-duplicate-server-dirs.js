// checks for duplicate server/route directories and fails with guidance
// Intended to be run in CI and locally: `node scripts/check-duplicate-server-dirs.js`
const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (err) {
    return false;
  }
}

function rel(p) {
  return path.relative(process.cwd(), p) || '.';
}

function reportAndExit(messages) {
  console.error('\nERROR: duplicate server/routes directories detected (canonical layout: src/server)\n');
  messages.forEach((m) => console.error(' - ' + m));
  console.error('\nResolution guidance:');
  console.error('  * Choose the canonical location: src/server (preferred).');
  console.error('  * Move code from the duplicate directory into src/server and update imports.');
  console.error('  * Remove (or archive) the duplicate top-level directory to avoid confusion.');
  console.error('  * Run the CI job again.');
  console.error('\nIf this repository intentionally uses a different canonical layout, update the CI check or docs accordingly.');
  process.exit(1);
}

(async function main() {
  const pairs = [
    ['server', 'src/server'],
    ['src/routes', 'src/server/routes']
  ];

  const cwd = process.cwd();
  const problems = [];

  for (const [a, b] of pairs) {
    const pa = path.join(cwd, a);
    const pb = path.join(cwd, b);
    const hasA = exists(pa);
    const hasB = exists(pb);

    if (hasA && hasB) {
      problems.push(`Both "${rel(pa)}" and "${rel(pb)}" exist. Remove or merge one to have a single canonical source.`);
    }
  }

  if (problems.length) {
    reportAndExit(problems);
  }

  console.log('OK: No duplicate server/routes directories found.');
  process.exit(0);
})();
