const fs = require('fs');
const path = require('path');
const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

function loadFixture(name) {
  const p = path.join(__dirname, 'fixtures', `${name}.html`);
  return fs.readFileSync(p, 'utf8');
}

const pages = ['products', 'attribute-groups', 'bulk-tags', 'dashboard'];

describe('Static accessibility smoke tests for admin pages', () => {
  pages.forEach((page) => {
    test(`${page}.html should have no violations (critical/serious)`, async () => {
      const html = loadFixture(page);
      // jsdom: set document body to the fixture
      document.documentElement.innerHTML = html;

      const results = await axe(document);

      // Fail on any violations. Teams can narrow this to severity thresholds later.
      expect(results).toHaveNoViolations();
    });
  });
});
