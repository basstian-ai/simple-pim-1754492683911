// Simple node check to validate the Query Duration Limits doc contains key guidance
const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error('TEST FAILED:', msg);
  process.exit(1);
}

function main() {
  const p = path.join(__dirname, '..', 'docs', 'query-duration-limits.md');
  if (!fs.existsSync(p)) fail('docs/query-duration-limits.md not found');

  const txt = fs.readFileSync(p, 'utf8');

  // Basic assertions that the most important strings are present
  const mustHave = [
    '30s',
    'QUERY_TIMEOUT',
    'export job',
    'pagination',
    'EXPORT_ATTEMPT_TIMEOUT'
  ];

  for (const s of mustHave) {
    if (!txt.includes(s)) fail(`expected "${s}" in query-duration-limits.md`);
  }

  console.log('All checks passed for docs/query-duration-limits.md');
}

main();
