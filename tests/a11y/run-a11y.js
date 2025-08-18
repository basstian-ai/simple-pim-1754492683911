const { chromium } = require('playwright');
const axeSource = require('axe-core').source;

async function run() {
  const baseUrl = process.env.A11Y_BASE_URL || 'http://localhost:3000';
  // Key admin routes to audit — adjust if your app uses different paths or locales
  const routes = [
    '/admin/products',
    '/admin/attribute-groups',
    '/admin/bulk-tags',
    '/admin/dashboard'
  ];

  console.log(`A11Y: base url = ${baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let totalViolations = 0;
  for (const route of routes) {
    const url = new URL(route, baseUrl).href;
    console.log(`\n---\nTesting: ${url}`);
    try {
      // allow single-page apps time to render; increase timeout if pages are heavy
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (err) {
      console.error(`Failed to load ${url}: ${err.message}`);
      // treat as a violation so CI fails when pages are unreachable
      totalViolations += 1;
      continue;
    }

    // inject axe and run WCAG2AA checks
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () => {
      // run only wcag2aa rules by default — adjust tags if you want stricter/looser checks
      return await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2aa'] } });
    });

    if (result.violations && result.violations.length) {
      console.error(`Found ${result.violations.length} violations on ${url}`);
      totalViolations += result.violations.length;
      for (const v of result.violations) {
        console.error(`\n[${v.id}] (${v.impact}) ${v.help}`);
        if (v.helpUrl) console.error(`  help: ${v.helpUrl}`);
        for (const node of v.nodes) {
          console.error(`  selector: ${node.target.join(' , ')}`);
          if (node.failureSummary) console.error(`  summary: ${node.failureSummary.replace(/\n/g, '\n    ')}`);
        }
      }
    } else {
      console.log(`No violations found on ${url}`);
    }
  }

  await browser.close();

  if (totalViolations > 0) {
    console.error(`\nAccessibility check failed: ${totalViolations} issues found.`);
    process.exit(1);
  }

  console.log('\nAccessibility check passed — no violations found (wcag2aa runOnly).');
  process.exit(0);
}

run().catch(err => {
  console.error('A11Y runner crashed:', err);
  process.exit(2);
});
