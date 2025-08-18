#!/usr/bin/env node
const { chromium } = require('playwright');
const { injectAxe, analyzeA11y } = require('@axe-core/playwright');

(async () => {
  const adminBase = process.env.ADMIN_URL;
  if (!adminBase) {
    console.log('\nADMIN_URL not set — skipping accessibility checks.');
    console.log('To run locally:');
    console.log('  ADMIN_URL=http://localhost:3000 npm run a11y\n');
    process.exit(0);
  }

  const pagesToCheck = [
    '/admin/products',
    '/admin/attribute-groups',
    '/admin/bulk-tags',
    '/admin/dashboard'
  ];

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext();
  let hadViolations = false;

  for (const path of pagesToCheck) {
    const url = adminBase.replace(/\/$/, '') + path;
    const page = await context.newPage();
    console.log('\n=== Checking', url, '===');
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      if (res && res.status() >= 400) {
        console.warn(`Warning: ${url} returned status ${res.status()}`);
      }

      // inject axe and run analysis
      await injectAxe(page);
      const results = await analyzeA11y(page);

      if (results.violations && results.violations.length) {
        hadViolations = true;
        console.error(`\nAccessibility violations found on ${url}:`);
        for (const v of results.violations) {
          console.error(`- [${v.id}] ${v.help} (impact: ${v.impact})`);
          console.error(`  ${v.helpUrl}`);
          // Print up to 3 offending nodes to help triage
          v.nodes.slice(0, 3).forEach((n, idx) => {
            console.error(`  Node ${idx + 1} selector: ${n.target.join(' | ')}`);
            if (n.failureSummary) console.error('    ', n.failureSummary.replace(/\n/g, ' '));
          });
        }
      } else {
        console.log(`No violations on ${url}`);
      }
    } catch (err) {
      console.error('Error checking', url, err && err.message ? err.message : err);
      hadViolations = true;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  if (hadViolations) process.exit(1);
  process.exit(0);
})().catch((err) => {
  console.error('Unhandled error running accessibility checks:', err);
  process.exit(2);
});
