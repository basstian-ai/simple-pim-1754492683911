import { test } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

// Key admin pages to audit. Add more paths as you iterate on fixes.
const pages = [
  '/admin/products',
  '/admin/attribute-groups',
  '/admin/bulk-tags',
  '/admin/dashboard'
];

for (const path of pages) {
  test(`a11y: ${path}`, async ({ page, baseURL }) => {
    const url = new URL(path, baseURL).toString();
    // Navigate and wait for network to be quiet. Adjust waitUntil if your app relies on SPA XHRs.
    await page.goto(url, { waitUntil: 'networkidle' });

    // inject axe and run checks
    await injectAxe(page);

    // checkA11y will throw if violations are found; axe output is also printed to console
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });
}
