# Accessibility audit and CI checks

This repository addition includes a minimal automated accessibility smoke-test harness and a CI workflow to run it.

What was added
- Jest-based accessibility tests using jest-axe + axe-core under tests/a11y/
- Four HTML fixtures approximating key admin pages (products, attribute-groups, bulk-tags, dashboard)
- GitHub Actions workflow that installs dev dependencies and runs the tests

How to run locally
- Node 18+ recommended
- npm ci
- npm test

Guidance
- These tests are intentionally conservative smoke tests (static HTML fixtures). They are meant to catch regressions and prevent accidental removals of semantic markup (headings, labels, table semantics, etc.).
- As the UI evolves, update tests/fixtures/*.html to match real page structure, or replace these with integration/e2e audits using puppeteer + axe-core or pa11y-ci against a running dev server.
