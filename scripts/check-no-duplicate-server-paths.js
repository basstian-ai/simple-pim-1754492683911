const fs = require('fs');
const path = require('path');

async function check() {
  const repoRoot = path.resolve(__dirname, '..');
  const pairs = [
    ['server', 'src/server'],
    ['src/routes', 'src/server/routes']
  ];

  const allowedShimFiles = new Set(['index.js', 'README.md', 'README', '.gitkeep', '.keep']);
  const errors = [];

  for (const [aRel, bRel] of pairs) {
    const a = path.join(repoRoot, aRel);
    const b = path.join(repoRoot, bRel);

    const aExists = fs.existsSync(a) && fs.statSync(a).isDirectory();
    const bExists = fs.existsSync(b) && fs.statSync(b).isDirectory();

    if (!aExists || !bExists) {
      // Nothing to validate for this pair if one side doesn't exist
      continue;
    }

    const aFiles = fs.readdirSync(a).filter(f => !allowedShimFiles.has(f));
    const bFiles = fs.readdirSync(b).filter(f => !allowedShimFiles.has(f));

    // If both directories contain non-whitelist files, flag it as a duplicate/conflict
    if (aFiles.length > 0 && bFiles.length > 0) {
      errors.push({
        pair: [aRel, bRel],
        aFiles: aFiles.slice(0, 20),
        bFiles: bFiles.slice(0, 20),
        message: `Both ${aRel} and ${bRel} contain non-shim files. This repository should have a single canonical server path (see docs/docs-server-layout.md).`
      });
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

if (require.main === module) {
  (async () => {
    try {
      const result = await check();
      if (!result.ok) {
        console.error('\nERROR: Duplicate server/route paths detected.');
        for (const e of result.errors) {
          console.error('\n- Conflict pair:', e.pair.join(' <-> '));
          console.error('  Files in', e.pair[0], ':', e.aFiles.length ? e.aFiles.join(', ') : '(none beyond whitelist)');
          console.error('  Files in', e.pair[1], ':', e.bFiles.length ? e.bFiles.join(', ') : '(none beyond whitelist)');
          console.error('  Guidance: Consolidate files into one canonical path (recommended: src/server). See docs/docs-server-layout.md for migration steps.');
        }
        process.exit(1);
      }
      console.log('OK: No duplicate server/route path conflicts detected.');
      process.exit(0);
    } catch (err) {
      console.error('Failed to run duplicate path check:', err);
      process.exit(2);
    }
  })();
}

module.exports = { check };