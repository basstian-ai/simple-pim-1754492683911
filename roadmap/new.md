REPO_SUMMARY
This repository is a Product Information Management (PIM) platform focused on managing product data with features such as attribute groups, product filtering, bulk tagging, dashboards, and AI-assisted attribute suggestions. It includes both front-end React/Next.js pages and back-end API endpoints. The platform supports CSV exports, search and filtering, and provides admin interfaces for managing attributes, products, and tags. It also includes health and readiness endpoints, query runners with timeout and retry logic, and various utilities for slug generation, SKU generation, and attribute suggestion.

STRUCTURE_FINDINGS
- The repository contains a clear separation between front-end pages (under pages/ and src/pages/) and API endpoints (under pages/api/).
- Admin-related UI and API routes are grouped under pages/admin/ and src/pages/admin/ with features like attribute groups management, bulk tagging, dashboards, and product management.
- Data files such as attribute groups and products are stored under data/ and are loaded by API endpoints.
- There are utilities and libraries under lib/, src/lib/, and utils/ for core logic like attribute groups, products, slugify, SKU generation, and query running.
- Tests are present under tests/ and src/__tests__/ covering UI components and API functionality.
- The roadmap directory contains task definitions, bug reports, and done logs to track project progress.
- The vision.md file defines the product vision emphasizing dashboards, unified product workspace, data quality, publishing, collaboration, extensibility, and UX principles.

TOP_MILESTONE
Dashboard

TASKS
Title: Attribute Groups Search (filters & pagination)
Rationale: Provide a searchable endpoint and admin UI for attribute groups with filtering and pagination to improve attribute management efficiency.
Acceptance: Server-side filtering supports code/label/type/required filters; paginated results are returned; robust error handling is implemented; API and UI tests cover the feature.
Files: pages/api/attribute-groups/search.js, pages/admin/attribute-groups-search.js, src/api/attributeGroups.ts, tests/api-attribute-groups-search.test.js
Tests: API endpoint tests for filtering and pagination; UI tests for search input, filter controls, and results display.

Title: Filtered CSV Export for Products
Rationale: Ensure CSV exports of products respect current list filters and pagination for accurate data extraction.
Acceptance: Export endpoints reflect applied search, tag, and in-stock filters; admin export link updates with filters; tests validate CSV content matches filters.
Files: pages/api/products/export.js, pages/admin/products.js, components/ExportCsvLink.js, tests/api-products-export.test.js
Tests: Integration tests for export endpoint with filters; UI tests for export link behavior.

Title: Bulk Tagging Preview and Apply in Admin UI
Rationale: Enable bulk tagging workflows with preview capability to reduce errors and improve admin productivity.
Acceptance: API preview endpoint returns expected tag additions/removals; admin UI allows SKU input, tag add/remove input, preview display, and batch apply; UI tests cover workflow.
Files: pages/api/products/tags/bulk-preview.js, pages/admin/bulk-tags.js, tests/api-products-tags-bulk-preview.test.js
Tests: API tests for bulk preview; UI tests for form submission, preview rendering, and error handling.

Title: Dashboard with Key Product & Tag Metrics
Rationale: Provide an admin dashboard showing product counts, in-stock status, tag usage, and recent activity for operational insights.
Acceptance: Dashboard UI displays total products, in-stock counts, tag stats, recent activity; API aggregates and caches data; error handling is robust.
Files: pages/api/dashboard.js, pages/admin/dashboard.js, src/api/dashboardHandler.js, tests/api-dashboard.test.js
Tests: API aggregation tests; UI rendering tests; error scenario tests.

Title: Query duration exceeded (long-running queries terminated)
Rationale: Investigate and fix long-running queries terminated after 5-minute cap to improve reliability.
Acceptance: Slow queries are identified with text and EXPLAIN plans; indexes and filters are added; pagination or batching implemented; timeouts, cancellations, retries added; regression tests cover scenarios.
Files: src/db/queryRunner.ts, lib/api/withTimeout.js, pages/api/products/search.js, tests/api-products-search.test.js
Tests: Performance tests for query duration; tests for timeout and retry logic; regression tests for query correctness.

DONE_UPDATES
- Created vendor-neutral PIM vision.md with UX and dashboards focus.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI and commands.
- Implemented wrappers for deployment and runtime logs.
- Added GitHub upsert helpers using Octokit.
- Added markdown helpers for fenced YAML blocks.
- Added lock and state mechanisms to avoid thrashing.
- Added prompts for log to bugs, review to ideas, task synthesis, and implementation plan.
- Completed Operations Overview dashboard with KPIs and widgets.
- Completed Data Quality dashboard with heatmap and rule leaderboard.
- Implemented global search with advanced filters and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component.