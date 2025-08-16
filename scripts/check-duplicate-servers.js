const fs = require('fs').promises;
const path = require('path');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch (e) {
    return false;
  }
}

async function listFiles(root) {
  const files = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) await walk(full);
      else if (ent.isFile()) files.push(path.relative(root, full).replace(/\\\\/g, '/'));
    }
  }
  await walk(root);
  return files;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

(async function main() {
  const repoRoot = process.cwd();
  const candidates = [
    { key: 'server', dir: path.join(repoRoot, 'server') },
    { key: 'src/server', dir: path.join(repoRoot, 'src', 'server') },
    { key: 'src/routes', dir: path.join(repoRoot, 'src', 'routes') },
    { key: 'server/routes', dir: path.join(repoRoot, 'server', 'routes') }
  ];

  const present = [];
  for (const c of candidates) if (await exists(c.dir)) present.push(c);

  if (present.length === 0) {
    console.log('No server/routes candidate directories found (none of server/, src/server/, src/routes/, server/routes/ exist).');
    process.exit(0);
  }

  // Group by logical pair: server vs src/server and routes under either
  const groups = [
    { name: 'server', paths: ['server', 'src/server'] },
    { name: 'routes', paths: ['src/routes', 'server/routes'] }
  ];

  let hasProblem = false;
  const preferred = 'src/server'; // canonical path we recommend

  for (const g of groups) {
    const found = [];
    for (const p of g.paths) {
      const full = path.join(repoRoot, p);
      if (await exists(full)) found.push({ rel: p, full });
    }
    if (found.length <= 1) continue; // nothing ambiguous

    console.error(`\nERROR: Duplicate logical directory detected for "${g.name}". Multiple locations exist:`);
    found.forEach(f => console.error(`  - ${f.rel}`));

    hasProblem = true;

    // If both 'server' and 'src/server' exist, check overlapping file names to make the warning actionable
    try {
      const fileMaps = {};
      for (const f of found) {
        fileMaps[f.rel] = await listFiles(f.full);
      }

      // find intersections
      const allFiles = Object.keys(fileMaps).reduce((acc, key) => acc.concat(fileMaps[key]), []);
      const dupFiles = allFiles.filter((v, i, a) => a.indexOf(v) !== i);
      const uniqueDupFiles = uniq(dupFiles);
      if (uniqueDupFiles.length) {
        console.error('\nConflicting files (same relative path present in multiple locations):');
        uniqueDupFiles.slice(0, 50).forEach(f => console.error(`  - ${f}`));
        if (uniqueDupFiles.length > 50) console.error(`  ...and ${uniqueDupFiles.length - 50} more`);
      } else {
        console.error('\nNo filename-level collisions detected, but the parallel directory structure is confusing and may lead to regressions.');
      }

      // Suggested consolidation commands
      console.error('\nSuggested consolidation (example):');
      if (found.some(f => f.rel === preferred)) {
        // prefer moving other locations into preferred
        for (const f of found) {
          if (f.rel === preferred) continue;
          console.error(`  # Move files from ${f.rel} into ${preferred} preserving history`);
          console.error(`  git mv ${f.rel}/* ${preferred}/ || (mkdir -p ${preferred} && git mv ${f.rel}/* ${preferred}/)`);
        }
      } else {
        // preferred doesn't exist; suggest creating it and moving
        console.error(`  # Create ${preferred} and move the canonical material there`);
        console.error(`  mkdir -p ${preferred}`);
        for (const f of found) {
          console.error(`  git mv ${f.rel} ${preferred}/`);
        }
      }

      console.error('\nAfter moving: run a codemod or search-replace to update imports. Examples:');
      console.error(`  # simple (may need tuning for TS/JS):`);
      console.error(`  # replace imports from "server/..." to "src/server/..."`);
      console.error(`  # ripgrep + sed example:`);
      console.error(`  rg "from \\\"server/" -g '!node_modules' -l | xargs -I{} sed -i '' 's@from \"server/@from \"src/server/@g' {}`);

    } catch (err) {
      console.error('Failed to analyze file overlaps:', err);
    }
  }

  if (hasProblem) {
    console.error('\nCONSOLIDATION REQUIRED: Repository contains duplicate logical server/routes directories.');
    console.error('Policy: The canonical server location is: ' + preferred);
    console.error('A CI check prevents adding new duplicate locations. Please consolidate and update imports.');
    process.exit(1);
  }

  console.log('Structure check passed: no duplicate server/routes directories detected.');
  process.exit(0);
})();
