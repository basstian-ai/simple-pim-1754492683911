// check-duplicate-servers.js
// Exit non-zero if duplicate server/route directories exist (e.g. `server` and `src/server`).
// This is intentionally conservative: it only detects duplicates and fails CI so a follow-up
// refactor/merge can be done with human review.

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function detectDuplicates(baseDir) {
  // Candidate pairs/groups to detect.
  const groups = [
    ['server', 'src/server'],
    ['routes', 'src/routes', 'src/server/routes', 'server/routes']
  ];

  const found = [];

  for (const group of groups) {
    const present = group.filter(rel => exists(path.join(baseDir, rel)));
    if (present.length > 1) {
      found.push({ group, present });
    }
  }

  return found;
}

function prettyList(items) {
  return items.map(i => `  - ${i}`).join('\n');
}

function main() {
  const base = process.argv[2] || process.env.CHECK_DUP_BASE || process.cwd();
  const duplicates = detectDuplicates(base);

  if (duplicates.length === 0) {
    console.log('check-duplicate-servers: ok — no duplicate server/route directories detected');
    process.exit(0);
  }

  console.error('check-duplicate-servers: ERROR — duplicate server/route directories detected');
  for (const d of duplicates) {
    console.error('\nDetected multiple entries from this candidate group:');
    console.error('Candidates:');
    console.error(prettyList(d.group.map(p => `"${p}"`)));
    console.error('Found:');
    console.error(prettyList(d.present.map(p => `"${p}"`)));
  }

  console.error('\nRecommendation: Consolidate to a single canonical location (e.g. choose "src/server"),');
  console.error('remove or move the duplicates, update imports, and add a short note to README or docs.');
  console.error('See project guidelines for the canonical server layout before applying automated fixes.');
  process.exit(2);
}

if (require.main === module) main();
