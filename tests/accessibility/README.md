# Accessibility tests (Playwright + axe)

How to run locally:

1. Install dependencies: npm ci
2. Install Playwright browsers: npx playwright install --with-deps
3. Ensure your app is running at the URL used by tests (default: http://localhost:3000) or set BASE_URL env.
4. Run tests: npm run test:a11y

Notes:
- The tests exercise a small set of high-priority admin pages. Adjust tests/accessibility/a11y.spec.ts to match real routes.
- On CI we attempt to start the app via `npm run start`. If your project uses a different start script, update the workflow.
