REPO_SUMMARY
This repository is a modern Product Information Management (PIM) platform focused on managing product data with features for dashboards, data quality, publishing, collaboration, and extensibility. It includes a Next.js front-end with React components, API routes under pages/api, and server-side logic. The repo contains admin interfaces for managing products, attributes, attribute groups, tags, and bulk operations. It also provides AI-assisted tools for attribute suggestions and product name generation. The platform emphasizes clarity, accessibility, performance, and observability.

STRUCTURE_FINDINGS
- The repo uses Next.js with API routes under pages/api and React components in pages and components directories.
- There are multiple admin pages under pages/admin for managing attributes, products, tags, dashboards, and AI tools.
- API endpoints cover products, attributes, attribute groups, tags, health checks, and AI suggestions.
- There is duplication in server and route directories (e.g., server vs src/server, src/routes vs src/server/routes) noted for consolidation.
- The lib and src directories contain core logic, services, and utilities for attribute groups, products, SKU generation, and query handling.
- Tests exist for admin tags, dry-run JSON preview, API products, and UI components.
- The roadmap includes tasks for improving API route conventions, AI-assisted attribute suggestions, SKU/slug uniqueness validation, accessibility audits, and fixing long-running query bugs.

TOP_MILESTONE
CRUD Admin

TASKS
1. Title: Consolidate duplicate server & route directories
   Rationale: Remove or merge duplicate server code paths to ensure a single canonical source for server logic, simplify maintenance, and prevent import confusion.
   Acceptance: Duplicate directories merged or removed; imports updated; CI checks added to prevent regressions; documentation updated.
   Files: server/, src/server/, src/routes/, scripts/check-duplicate-server-paths.js
   Tests: CI checks for directory duplication; manual verification of server functionality.

2. Title: Standardize API route conventions and documentation
   Rationale: Define and enforce consistent API route layout, naming, and request/response schemas to improve developer experience and maintainability.
   Acceptance: API routes follow a documented convention; route-level docs and examples added; linting/validation integrated.
   Files: pages/api/, src/routes/, docs/api.md (to be created)
   Tests: Automated linting/validation tests; manual API contract verification.

3. Title: AI-assisted attribute suggestions in Admin
   Rationale: Enhance admin UX by adding AI-backed suggestions for attribute groups, values, and mappings based on product data and history.
   Acceptance: Suggestions panel implemented; opt-in telemetry and preview mode available; API route for suggestions functional.
   Files: pages/admin/attribute-suggest.js, pages/api/attributes/suggest.js, lib/attributeSuggestor.js
   Tests: Unit and integration tests for suggestion API; UI tests for suggestions panel.

4. Title: SKU & slug uniqueness validation and collision handling
   Rationale: Prevent SKU and slug collisions by adding robust validation, user-friendly errors, auto-suffixing, and tests for concurrency.
   Acceptance: Validation on create/edit; collision errors surfaced; auto-suffixing option implemented; concurrency tested.
   Files: lib/sku.js, pages/admin/sku.js, pages/api/sku.js
   Tests: Unit tests for validation logic; integration tests for API; concurrency test scenarios.

5. Title: Accessibility audit and fixes for admin UI
   Rationale: Ensure admin pages meet WCAG 2.1 AA standards for accessibility, improving usability for all users.
   Acceptance: Audit completed; issues fixed on key admin pages; automated accessibility checks added to CI.
   Files: pages/admin/, components/, tests/accessibility.test.js (to be added)
   Tests: Automated a11y tests in CI; manual audit reports.

6. Title: Investigate and fix long-running query timeouts (BUG-dpl_HK-1755266967960)
   Rationale: Queries exceeding 5-minute execution cap cause runtime errors and incomplete results; need to optimize or paginate.
   Acceptance: Offending queries identified; indexes/filters added or queries paginated; EXPLAIN plans captured on timeout.
   Files: lib/productsStore.js, src/services/productService.ts, pages/api/products/search.js
   Tests: Performance tests; monitoring for query duration; regression tests.

7. Title: Investigate and fix additional long-running query timeouts (BUG-dpl_8G-1755344862515)
   Rationale: Additional queries exceed execution limit causing failures; need similar investigation and fixes.
   Acceptance: Queries reviewed and optimized; pagination or batching added; instrumentation for future detection.
   Files: lib/productsStore.js, src/services/productService.ts, pages/api/products/index.js
   Tests: Performance and regression tests; monitoring setup.

DONE_UPDATES
- Created vendor-neutral PIM vision.md with UX and dashboards focus.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI and commands.
- Implemented wrappers for deployment and runtime logs.
- Added GitHub upsert helpers using Octokit.
- Added markdown helpers for fenced YAML blocks.
- Added lock and state mechanisms to avoid thrash.
- Added prompts for log to bugs, review to ideas, task synthesis, and implementation planning.
- Delivered Operations Overview dashboard with KPIs and widgets.
- Delivered Data Quality dashboard with heatmap and rule leaderboard.
- Implemented global search, advanced filters, and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component and tests.