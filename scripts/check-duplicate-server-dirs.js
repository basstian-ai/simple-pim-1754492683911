'use strict';
const fs = require('fs');
const path = require('path');

function exists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function root(...parts) {
  return path.resolve(process.cwd(), ...parts);
}

function checkDuplicates() {
  const findings = [];

  // Common duplicate locations we want a single canonical location for
  const checks = [
    {
      name: 'server directory',
      canonical: 'src/server',
      candidates: ['server', 'src/server']
    },
    {
      name: 'routes directory (top-level)',
      canonical: 'src/server/routes',
      candidates: ['routes', 'src/routes', 'src/server/routes']
    }
  ];

  checks.forEach(({ name, canonical, candidates }) => {
    const present = candidates.filter(c => exists(root(c)));
    // If more than one candidate exists, that's a duplication we want to flag.
    if (present.length > 1) {
      findings.push({ name, canonical, present });
    }
  });

  return { duplicates: findings };
}

// When run directly, print useful guidance and exit with non-zero on failure
if (require.main === module) {
  const res = checkDuplicates();
  if (res.duplicates.length === 0) {
    console.log('OK: No duplicate server/routes directories detected.');
    process.exit(0);
  }

  console.error('\nERROR: Duplicate server/routes directories found.');
  res.duplicates.forEach(d => {
    console.error('\n- ' + d.name + '\n  canonical: ' + d.canonical + '\n  found:');
    d.present.forEach(p => console.error('    - ' + p));
    console.error('\n  Recommended action: choose the canonical path above and consolidate as follows:');
    console.error('    - Move files to the canonical location (example): git mv ' + d.present[0] + ' ' + d.canonical);
    console.error('    - Update import paths in source files to reference the canonical layout.');
    console.error('    - Remove the duplicate directory once code compiles and tests pass.\n');
  });
  console.error('CI will fail until duplicates are resolved.');
  process.exit(2);
}

module.exports = { checkDuplicates };
