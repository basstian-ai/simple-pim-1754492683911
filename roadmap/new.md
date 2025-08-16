REPO_SUMMARY
This repository implements a Product Information Management (PIM) platform with a focus on managing attribute groups, products, tags, and related data. It includes admin interfaces, public APIs, AI-assisted attribute suggestions, dashboards, and tools for SKU generation, slugification, and bulk tagging. The platform supports features such as filtering, CSV export, variant generation, and attribute group audits. The codebase uses React for front-end pages and components, Next.js API routes for backend logic, and includes utilities for data handling, query retries, and observability.

STRUCTURE_FINDINGS
- The repository contains a clear separation between front-end pages (under pages/ and src/pages/), API routes (pages/api/), and components (components/, src/components/).
- There are multiple admin pages for managing attribute groups, products, tags, and bulk operations.
- API endpoints provide CRUD and search capabilities for products, attributes, attribute groups, and tags, including export and summary endpoints.
- AI-assisted features exist for attribute suggestions and product name suggestions, with dedicated API routes and UI tools.
- Utilities and libraries handle slugification, SKU generation, query retries, and CSV export.
- The roadmap and task management are maintained in markdown and YAML files under the roadmap/ directory.
- Tests cover components, API routes, and integration scenarios, with Jest and Supertest as dependencies.

TOP_MILESTONE
CRUD Admin

TASKS
Title: Consolidate duplicate server & route directories
Rationale: Remove or merge duplicate server code paths (server vs src/server and src/routes vs src/server/routes) to ensure a single canonical source for server logic and prevent import confusion.
Acceptance: Duplicate directories are merged or removed, imports updated, and CI checks added to prevent regressions.
Files: server/, src/server/, src/routes/, src/server/routes/, scripts/check-server-layout.js, scripts/check-duplicate-server.js
Tests: CI checks for import correctness and duplicate detection

Title: Standardize API route conventions and documentation
Rationale: Define and enforce consistent API route layout, naming conventions, and request/response schemas to improve maintainability and developer experience.
Acceptance: API routes follow a documented convention, have route-level docs and examples, and include linting/validation.
Files: pages/api/, src/routes/, docs/api.md (to be created)
Tests: Linting and validation tests for API routes

Title: AI-assisted attribute suggestions in Admin
Rationale: Add an AI-backed suggestions panel in the admin UI to propose attribute groups, values, and mapping hints based on product text and historical data.
Acceptance: Admin UI includes a suggestions panel; API route supports suggestions; opt-in telemetry and preview mode are implemented.
Files: pages/admin/attribute-suggest.js, pages/api/attributes/suggest.js, lib/attributeSuggestor.js
Tests: UI interaction tests, API endpoint tests, telemetry opt-in tests

Title: SKU & slug uniqueness validation and collision handling
Rationale: Ensure SKU and slug uniqueness at creation and on edits; provide friendly errors and auto-suffixing options to prevent collisions.
Acceptance: Validation logic added; UI surfaces errors; auto-suffixing available; tests cover race conditions and concurrent writes.
Files: lib/sku.js, pages/admin/sku.js, pages/api/sku.js
Tests: Unit tests for validation, concurrency tests for race conditions

Title: Accessibility audit and fixes for admin UI
Rationale: Improve accessibility of key admin pages by fixing ARIA roles, keyboard focus, color contrast, and adding automated accessibility checks.
Acceptance: Accessibility issues resolved; CI includes automated a11y checks; keyboard navigation verified.
Files: pages/admin/, components/, tests/a11y.test.js (to be added)
Tests: Automated accessibility tests, manual keyboard navigation tests

Title: Investigate and fix long-running queries hitting 5-minute execution cap (BUG-dpl_HK-1755266967960)
Rationale: Queries exceeding 5-minute execution limit cause runtime errors and incomplete results; need to optimize queries or paginate/batch work.
Acceptance: Queries optimized or paginated; EXPLAIN plans captured on timeout; runtime errors reduced.
Files: lib/productsStore.js, src/services/productService.ts, pages/api/products/search.js
Tests: Performance tests, query timeout handling tests

Title: Investigate and fix additional long-running queries hitting 5-minute execution cap (BUG-dpl_8G-1755344862515)
Rationale: Additional queries exceed execution limit causing failures; need to review query plans and add instrumentation.
Acceptance: Queries reviewed and optimized; instrumentation added to identify long runs.
Files: lib/productsStore.js, src/services/productService.ts, pages/api/products/index.js
Tests: Query instrumentation tests, timeout handling tests

DONE_UPDATES
- Created vendor-neutral PIM vision.md with UX and dashboard focus.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI and commands.
- Implemented vercel.ts wrappers for deployment and runtime logs.
- Implemented github.ts upsert helpers using Octokit.
- Implemented md.ts helpers for fenced YAML blocks.
- Added lock and state mechanisms to avoid thrashing.
- Added prompts for log to bugs, review to ideas, task synthesis, and implementation planning.
- Delivered Operations Overview dashboard with KPIs and widgets.
- Delivered Data Quality dashboard with heatmap and rule leaderboard.
- Delivered Global search with advanced filters and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component and tests.