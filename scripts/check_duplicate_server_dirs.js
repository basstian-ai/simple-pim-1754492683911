const fs = require('fs');
const path = require('path');

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (err) {
    return false;
  }
}

// Returns 0 (ok) or non-zero (error)
function checkDuplicateDirs(baseDir = process.cwd()) {
  const candidates = {
    server: path.join(baseDir, 'server'),
    src_server: path.join(baseDir, 'src', 'server'),
    src_routes: path.join(baseDir, 'src', 'routes'),
    src_server_routes: path.join(baseDir, 'src', 'server', 'routes')
  };

  const found = {};
  for (const [k, p] of Object.entries(candidates)) {
    found[k] = isDir(p);
  }

  const duplicates = [];
  if (found.server && found.src_server) {
    duplicates.push({ type: 'server', paths: ['server', 'src/server'] });
  }
  if (found.src_routes && found.src_server_routes) {
    duplicates.push({ type: 'routes', paths: ['src/routes', 'src/server/routes'] });
  }
  // Mixed-case: server + src/server/routes can also be confusing
  if (found.server && found.src_server_routes) {
    duplicates.push({ type: 'mixed', paths: ['server', 'src/server/routes'] });
  }

  if (duplicates.length === 0) {
    console.log('OK: No duplicate server/route directories detected.');
    return 0;
  }

  console.error('\nERROR: Duplicate server/route directories detected.');
  for (const d of duplicates) {
    console.error(` - Duplicate (${d.type}): ${d.paths.join(' and ')}`);
  }
  console.error('\nRecommended canonical layout: "src/server" (server code and its routes under src/server).');
  console.error('See docs/server-layout.md for migration guidance and examples.');
  console.error('\nTo unblock CI temporarily: merge or remove the duplicate path and ensure imports reference the chosen canonical path.');

  return 2;
}

if (require.main === module) {
  const code = checkDuplicateDirs(process.cwd());
  process.exit(code);
}

module.exports = { checkDuplicateDirs };
