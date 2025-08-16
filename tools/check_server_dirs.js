// tools/check_server_dirs.js
// Small utility to detect duplicate server/route directory layouts that can cause
// ambiguity (e.g. "server" vs "src/server", "src/routes" vs "src/server/routes").
// Exits with code 0 if layout is OK, 1 if duplicates are found. Prints machine
// readable JSON as well as human messages.

const fs = require('fs');
const path = require('path');

function existsSync(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (err) {
    return false;
  }
}

function check(root) {
  const checks = [];

  const server = path.join(root, 'server');
  const srcServer = path.join(root, 'src', 'server');
  const srcRoutes = path.join(root, 'src', 'routes');
  const srcServerRoutes = path.join(root, 'src', 'server', 'routes');

  if (existsSync(server) && existsSync(srcServer)) {
    checks.push({
      key: 'duplicate-server-dir',
      message: 'Both "server/" and "src/server/" directories exist. Choose a single canonical location for server code and consolidate duplicates.',
      paths: [server, srcServer]
    });
  }

  if (existsSync(srcRoutes) && existsSync(srcServerRoutes)) {
    checks.push({
      key: 'duplicate-routes-dir',
      message: 'Both "src/routes/" and "src/server/routes/" directories exist. Choose a single canonical location for route handlers and consolidate duplicates.',
      paths: [srcRoutes, srcServerRoutes]
    });
  }

  return checks;
}

function main() {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const checks = check(root);

  const result = {
    root,
    ok: checks.length === 0,
    problems: checks
  };

  // Print human readable output
  if (result.ok) {
    console.log('OK: no duplicate server/route directories detected under %s', root);
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  console.error('ERROR: duplicate server/route directories detected under %s', root);
  checks.forEach((c, i) => {
    console.error('\n%d) %s', i + 1, c.message);
    c.paths.forEach(p => console.error('   - %s', p));
  });
  console.error('\nFull result JSON:\n%s', JSON.stringify(result, null, 2));
  process.exit(1);
}

if (require.main === module) {
  main();
}
