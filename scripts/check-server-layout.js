// scripts/check-server-layout.js
// Exit non-zero when duplicate/ambiguous server/layouts are detected.

const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
}

function listFiles(dir) {
  const out = [];
  if (!exists(dir)) return out;
  const walk = (cur, base) => {
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(cur, e.name);
      const rel = path.join(base, e.name);
      if (e.isDirectory()) {
        walk(full, rel);
      } else if (e.isFile()) {
        out.push(rel.replace(/\\\\/g, '/'));
      }
    }
  };
  walk(dir, '');
  return out;
}

function isShim(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('SHIM - DO NOT EDIT');
  } catch (e) {
    return false;
  }
}

function fail(msg) {
  console.error('ERROR: ' + msg);
  process.exitCode = 2;
  throw new Error(msg);
}

(function main() {
  const TOP = process.cwd();
  const TOP_SERVER = path.join(TOP, 'server');
  const SRC_SERVER = path.join(TOP, 'src', 'server');
  const SRC_ROUTES = path.join(TOP, 'src', 'routes');
  const SRC_SERVER_ROUTES = path.join(SRC_SERVER, 'routes');

  const serverFiles = listFiles(TOP_SERVER);
  const srcServerFiles = listFiles(SRC_SERVER);
  const srcRoutesFiles = listFiles(SRC_ROUTES);
  const srcServerRoutesFiles = listFiles(SRC_SERVER_ROUTES);

  // If neither location has files, nothing to check
  if (serverFiles.length === 0 && srcServerFiles.length === 0 && srcRoutesFiles.length === 0 && srcServerRoutesFiles.length === 0) {
    console.log('OK: no server/src-server/src-routes detected.');
    return;
  }

  // Determine canonical location preference: prefer src/server when present
  const canonical = srcServerFiles.length > 0 ? 'src/server' : (serverFiles.length > 0 ? 'server' : null);

  if (!canonical) {
    console.log('OK: no canonical server detected.');
    return;
  }

  // If both server and src/server contain files, ensure server only contains shim files or re-exports.
  if (serverFiles.length > 0 && srcServerFiles.length > 0) {
    const problematic = [];
    for (const rel of serverFiles) {
      const full = path.join(TOP, 'server', rel);
      if (!isShim(full)) {
        // If a file exists with same relative path in src/server, that's a duplicate implementation
        if (srcServerFiles.includes(rel)) {
          problematic.push(rel);
        } else {
          // Also treat non-shim top-level server files as problematic because repo should centralize under src/server
          problematic.push(rel);
        }
      }
    }
    if (problematic.length > 0) {
      fail(
        'Duplicate/ambiguous server implementation detected. Files found both in server/ and src/server/:\n' +
          problematic.map(p => '  - ' + p).join('\n') +
          '\n\nRecommendation: consolidate server code under src/server/ and keep server/ limited to lightweight shims (these use `// SHIM - DO NOT EDIT` header). Move implementation files from server/ into src/server/ and remove duplicates. See docs/server-layout.md for details.'
      );
    }
  }

  // Check for duplicate routes between src/routes and src/server/routes
  if (srcRoutesFiles.length > 0 && srcServerRoutesFiles.length > 0) {
    const overlap = srcRoutesFiles.filter(f => srcServerRoutesFiles.includes(f));
    if (overlap.length > 0) {
      fail(
        'Duplicate routes detected in src/routes/ and src/server/routes/:\n' +
          overlap.map(p => '  - ' + p).join('\n') +
          '\n\nRecommendation: choose a single routes directory (prefer src/server/routes) and move the other contents there.'
      );
    }
  }

  console.log('OK: server/layout check passed. canonical=' + canonical);
})();
