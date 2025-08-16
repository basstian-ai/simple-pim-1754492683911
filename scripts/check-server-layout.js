'use strict';

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

const pairs = [
  { a: 'server', b: path.join('src', 'server'), label: 'server' },
  { a: path.join('src', 'routes'), b: path.join('src', 'server', 'routes'), label: 'routes' }
];

const found = [];

for (const p of pairs) {
  const aExists = fs.existsSync(path.join(cwd, p.a));
  const bExists = fs.existsSync(path.join(cwd, p.b));
  if (aExists && bExists) {
    found.push({ pair: p, a: path.join(cwd, p.a), b: path.join(cwd, p.b) });
  }
}

if (found.length === 0) {
  console.log('Layout check passed: no duplicate server/route directories found.');
  process.exit(0);
}

console.error('Duplicate server/route directories detected. To avoid ambiguous imports and multiple codepaths, pick one canonical layout (recommended: src/server) and consolidate.');
for (const f of found) {
  console.error('\n- Duplicate type: %s', f.pair.label);
  console.error('  Paths:');
  console.error('    %s', f.a);
  console.error('    %s', f.b);
}

console.error('\nSuggested steps:');
console.error('  1) Move files into the canonical directory (recommended: src/server).');
console.error('     Example: git mv server/* src/server/ || mkdir -p src/server && git mv server src/server');
console.error('  2) Update imports (automate with a codemod or search/replace).');
console.error('  3) Remove the duplicate directory and run the layout check.');
console.error('\nThis repository includes a CI check to prevent re-introducing duplicates.');

process.exit(1);
