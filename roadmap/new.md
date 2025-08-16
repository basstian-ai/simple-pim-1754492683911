REPO_SUMMARY
This repository implements a Product Information Management (PIM) platform focused on managing product attribute groups, products, tags, and related metadata. It includes admin UI pages for managing attribute groups, products, tags, and bulk operations, as well as public-facing product listing and detail pages. The backend exposes REST API endpoints under pages/api for attributes, attribute groups, products, tags, and AI-assisted suggestions. The system supports features like attribute group searching, duplicate detection, CSV export, SKU and slug generation, and AI-based attribute suggestions. The codebase uses React for frontend components and Next.js API routes for backend logic. It also includes utilities for slugifying, SKU generation, query running with timeouts, and CSV export. Testing and observability components are present, along with CI scripts and audit documentation.

STRUCTURE_FINDINGS
- The repository has duplicate server code directories: both "server" and "src/server" exist with overlapping content.
- API routes are implemented mainly under "pages/api" with some duplication or overlap with "src/routes".
- Admin UI pages are under "pages/admin" and include attribute groups, products, tags, dashboards, and AI tools.
- Attribute groups have multiple views: grouped, flat, duplicates audit, and search, each with corresponding API endpoints.
- AI-assisted features include attribute suggestions and product name suggestions, with dedicated API endpoints and UI tools.
- Utilities and libraries for attribute groups, products, SKU generation, slugification, and query running are in "lib" and "src" folders.
- Testing is present for admin tags, attribute groups, products, and UI components, using Jest and React Testing Library.

TOP_MILESTONE
CRUD Admin

TASKS
Title: Consolidate duplicate server & route directories
Rationale: Duplicate server code paths (server vs src/server and src/routes vs src/server/routes) cause confusion and maintenance overhead. Consolidation will ensure a single canonical source for server logic, simplify imports, and prevent regressions.
Acceptance: Duplicate directories removed or merged; all imports updated; CI checks added to prevent reintroduction; documentation updated to reflect chosen layout.
Files: server/, src/server/, src/routes/, scripts/check-duplicate-servers.js
Tests: Existing API and integration tests pass without regressions.

Title: Standardize API route conventions and documentation
Rationale: API routes are split between pages/api and server routes with inconsistent naming and schemas. Standardizing layout, naming, and request/response schemas improves maintainability and developer experience.
Acceptance: Defined API route layout and naming conventions documented; routes refactored to conform; route-level docs and examples added; linting/validation integrated in CI.
Files: pages/api/, src/routes/, docs/api.md (new)
Tests: API route tests updated and passing; linting runs in CI.

Title: AI-assisted attribute suggestions in Admin
Rationale: Adding AI-backed suggestions for attribute groups, values, and mappings will improve user productivity and data quality by proposing relevant attributes based on product text and history.
Acceptance: Admin UI panel for AI suggestions implemented with opt-in telemetry and preview mode; API route for suggestions added; user can accept or reject suggestions.
Files: pages/admin/attribute-suggest.js, pages/api/attributes/suggest.js, lib/attributeSuggestor.js
Tests: Unit and integration tests for suggestion API and UI; telemetry opt-in tested.

Title: SKU & slug uniqueness validation and collision handling
Rationale: Ensuring SKU and slug uniqueness prevents data conflicts and improves user experience. Auto-suffixing and friendly error messages help users resolve collisions.
Acceptance: Validation added on create/edit for SKU and slug uniqueness; auto-suffixing options implemented; race conditions and concurrent write scenarios tested.
Files: pages/api/sku.js, pages/api/products/[sku].js, pages/admin/sku.js
Tests: Validation and collision handling tests; concurrency tests.

Title: Accessibility audit and fixes for admin UI
Rationale: Improving accessibility ensures compliance with WCAG 2.1 AA and better usability for all users.
Acceptance: Accessibility audit completed for key admin pages; issues fixed (ARIA attributes, keyboard focus, color contrast); automated accessibility checks added to CI.
Files: pages/admin/, components/, tests/a11y.test.js (new)
Tests: Automated a11y tests in CI; manual audit report.

DONE_UPDATES
No done updates provided in the current manifest or roadmap/done.md excerpt.