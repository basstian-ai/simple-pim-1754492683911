// Check for duplicate server & routes directory layouts
// Exports checkPaths(baseDir) for programmatic use and acts as a CLI when run directly.
const fs = require('fs').promises;
const path = require('path');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch (_) {
    return false;
  }
}

async function listFiles(root) {
  const out = [];
  async function walk(dir, prefix = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const rel = path.posix.join(prefix, e.name);
      if (e.isDirectory()) {
        await walk(full, rel);
      } else if (e.isFile()) {
        out.push(rel);
      }
    }
  }
  await walk(root);
  return out;
}

async function checkPaths(baseDir = process.cwd()) {
  baseDir = path.resolve(baseDir);
  const rootServer = path.join(baseDir, 'server');
  const srcServer = path.join(baseDir, 'src', 'server');
  const srcRoutes = path.join(baseDir, 'src', 'routes');
  const srcServerRoutes = path.join(baseDir, 'src', 'server', 'routes');

  const problems = [];

  if (await exists(rootServer) && await exists(srcServer)) {
    const rootFiles = await listFiles(rootServer);
    const srcFiles = await listFiles(srcServer);
    const collisions = rootFiles.filter(f => srcFiles.includes(f));
    problems.push({
      pair: 'server vs src/server',
      paths: [rootServer, srcServer],
      collisions
    });
  }

  if (await exists(srcRoutes) && await exists(srcServerRoutes)) {
    const routeFiles = await listFiles(srcRoutes);
    const serverRouteFiles = await listFiles(srcServerRoutes);
    const collisions = routeFiles.filter(f => serverRouteFiles.includes(f));
    problems.push({
      pair: 'src/routes vs src/server/routes',
      paths: [srcRoutes, srcServerRoutes],
      collisions
    });
  }

  if (problems.length === 0) {
    console.log('OK: No duplicate server/routes paths detected.');
    return { ok: true };
  }

  // Build helpful message for maintainers
  const lines = [];
  lines.push('Duplicate server/routes path layout detected.');
  lines.push('This repository should consolidate to a single canonical layout (recommended: src/server + src/server/routes).');
  lines.push('');
  for (const p of problems) {
    lines.push(`Conflict: ${p.pair}`);
    lines.push(` - Paths: ${p.paths[0]}  AND  ${p.paths[1]}`);
    if (p.collisions && p.collisions.length) {
      lines.push(' - Overlapping file paths:');
      for (const c of p.collisions.slice(0, 50)) {
        lines.push(`    • ${c}`);
      }
      if (p.collisions.length > 50) lines.push(`    ...and ${p.collisions.length - 50} more`);
    } else {
      lines.push(' - No filename collisions detected, but both directories exist which risks ambiguity and import regressions.');
    }
    lines.push('');
  }
  lines.push('Guidance:');
  lines.push(' - Choose the canonical layout (recommended: src/server).');
  lines.push(' - Move files from the alternate location into the canonical location and update imports.');
  lines.push(' - Remove the duplicate directory once imports/build pass.');
  lines.push(' - This CI check will block merges until duplicates are resolved.');

  const message = lines.join('\n');
  const err = new Error(message);
  err.problems = problems;
  throw err;
}

// CLI entry
if (require.main === module) {
  checkPaths().then(() => process.exit(0)).catch(err => {
    console.error('\nERROR: Duplicate server/routes layout detected.');
    console.error(err.message);
    process.exit(2);
  });
}

module.exports = { checkPaths };