# Accessibility audit & fixes — Admin UI

This document records the initial accessibility improvement task and the minimal, testable fixes landed in this change.

Scope
- Run an a11y audit for key admin pages (products, attribute-groups, bulk-tags, dashboard)
- Fix common issues: missing labels, table semantics, ARIA attributes, keyboard focusable controls
- Add automated accessibility checks to CI (component-level axe tests)

What this change includes
- Small, accessible AdminProducts component that demonstrates and enforces accessibility patterns:
  - Visible and programmatic labels for inputs
  - Semantic table with <caption> and proper <th> elements
  - Action buttons with explicit aria-labels
  - Use of aria-sort and descriptive aria-labels for stock state
- Automated accessibility check added: jest + jest-axe test for the AdminProducts component
- CI workflow runs unit tests (see .github/workflows/a11y.yml)

Next steps
- Add similar component-level axe tests for attribute-groups, bulk-tags and dashboard pages
- Integrate end-to-end accessibility scans (pa11y / pa11y-ci or axe-cli) after a production build
- Perform manual audit with keyboard-only navigation and screen reader (NVDA/VoiceOver)

Guiding rules followed
- Prefer native HTML elements (button, input, table) over non-semantic controls
- Ensure all interactive elements are reachable by keyboard
- Provide readable labels and programmatic descriptions for assistive tech
