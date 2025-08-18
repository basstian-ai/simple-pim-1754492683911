import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

// Pages to include in the admin accessibility audit. Adjust paths as needed to match the app's routes.
const pages = [
  '/admin/products',
  '/admin/attribute-groups',
  '/admin/bulk-tags',
  '/admin/dashboard'
];

for (const path of pages) {
  test(`a11y: ${path}`, async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${path}`);

    // Inject axe and run accessibility checks
    await injectAxe(page);
    await checkA11y(page, undefined, {
      detailedReport: true
    });
  });
}
