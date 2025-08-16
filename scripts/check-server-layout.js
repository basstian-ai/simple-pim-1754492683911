const fs = require('fs');
const path = require('path');

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

const cwd = process.cwd();
const candidates = {
  topServer: path.join(cwd, 'server'),
  srcServer: path.join(cwd, 'src', 'server'),
  srcRoutes: path.join(cwd, 'src', 'routes'),
  srcServerRoutes: path.join(cwd, 'src', 'server', 'routes')
};

const problems = [];

if (isDir(candidates.topServer) && isDir(candidates.srcServer)) {
  problems.push("Both top-level 'server/' and 'src/server/' directories exist. Choose and keep a single canonical location (recommended: 'src/server/') and consolidate code.");
}

if (isDir(candidates.srcRoutes) && isDir(candidates.srcServerRoutes)) {
  problems.push("Both 'src/routes/' and 'src/server/routes/' exist. Consolidate routes under a single routes directory (recommended: 'src/server/routes/').");
}

if (problems.length === 0) {
  console.log('OK: No duplicate server/route directories detected.');
  process.exit(0);
}

console.error('\nERROR: Duplicate server/route directories detected:\n');
problems.forEach((p, i) => console.error(`${i + 1}. ${p}\n`));

console.error('Suggested resolution steps:\n');
console.error(" - Pick 'src/server/' as the canonical server directory (recommended).\n");
console.error(" - Move or merge files from the alternate location into the canonical location.\n");
console.error(" - Update imports and path aliases (e.g. search for 'server/...' and replace with 'src/server/...' or update tsconfig/jsconfig paths).\n");
console.error(" - Remove the duplicate directory after migration is verified.\n");
console.error(" - Re-run this check: node scripts/check-server-layout.js\n");

console.error('Automation notes:\n');
console.error(" - The CI check will fail if duplicates are present.\n");
console.error(" - To temporarily allow duplicates (not recommended), set CHECK_SERVER_LAYOUT_WARN=1 or ALLOW_DUPLICATES=1 in the environment; the script will exit 0 but print a warning.\n");

const allowWarn = process.env.CHECK_SERVER_LAYOUT_WARN === '1' || process.env.ALLOW_DUPLICATES === '1';
if (allowWarn) {
  console.warn('\nWARNING: Duplicates detected but continuing because CHECK_SERVER_LAYOUT_WARN or ALLOW_DUPLICATES is set.');
  process.exit(0);
}

process.exit(1);
