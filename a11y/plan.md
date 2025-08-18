# Accessibility audit plan — Admin UI

Goal
- Run an accessibility audit across key admin pages (products, attribute-groups, bulk-tags, dashboard), fix issues (ARIA, keyboard, focus order, color contrast), and add automated checks to CI.

Scope / pages
- /admin/products
- /admin/attribute-groups
- /admin/bulk-tags
- /admin/dashboard

Steps
1. Automated scan
   - Add Playwright + axe tests (provided) to surface obvious issues (missing ARIA roles, color contrast, missing labels).
   - Run scans on feature branches and in CI for PRs.

2. Manual audit (keyboard & screen reader)
   - Keyboard only: Ensure logical tab order, visible focus styles, no keyboard traps.
   - Screen reader: Walk key flows with NVDA/VoiceOver to validate meaningful announcements, list semantics, and skip links.

3. Visual checks
   - Verify color contrast for primary UI elements and states (focus, disabled, error).
   - Ensure focus styles meet WCAG contrast when overlaid on patterned backgrounds.

4. Fixes and patterns
   - Provide reusable components / hooks: Accessible Button, IconButton, FormField (label + hint + error), Modal (focus trap + aria-modal), SkipToContent link, and keyboard-friendly dropdowns.
   - Document ARIA and keyboard expectations in component README.

5. CI integration
   - Keep Playwright+axe tests in CI (see .github/workflows/a11y.yml).
   - Fail PRs on new violations; allow a brief grace period to remediate existing baseline items.

6. Regression prevention
   - Add storybook a11y addon or chromatic/a11y checks for interactive components (future step).

Acceptance criteria
- No new high/critical axe violations introduced on the audited pages.
- Manual keyboard + screen reader checks pass for the core CRUD flows on the four pages.
- CI runs accessibility tests for pull requests.

Prioritization of fixes
- Critical / High: missing labels on form controls, broken keyboard navigation, role/landmark issues that prevent screen reader navigation.
- Medium: color contrast failures for body text, unclear focus styles.
- Low: non-critical ARIA attributes that can be improved later.

Owner
- Frontend team + QA; aim for initial remediation within two sprints, and CI enforcement in the same sprint.
