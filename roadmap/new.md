REPO_SUMMARY
This repository implements a Product Information Management (PIM) platform with a focus on managing product data, attribute groups, tags, and variants. It includes an admin interface with filtering, bulk tagging, attribute group management, and dashboards for product and tag metrics. The platform offers REST API endpoints for products, attributes, attribute groups, tags, and health checks. It supports CSV export, search with filters, and AI-assisted attribute and name suggestions. The codebase uses React for frontend pages and components, Next.js API routes for backend logic, and includes utilities for query running with timeouts and retries.

STRUCTURE_FINDINGS
- The repository contains separate directories for client, components, server, pages, and API routes, with some duplication between server and src/server, and between src/routes and src/server/routes.
- API routes are organized under pages/api with endpoints for products, attributes, attribute-groups, tags, AI suggestions, health checks, and admin operations.
- Admin UI pages under pages/admin provide interfaces for managing products, attribute groups (including search, duplicates, grouped and flat views), bulk tagging, dashboards, and AI tools.
- Components include reusable UI elements like product lists, export CSV links, stock filters, attribute group editors, and recent failure feeds.
- Utilities and libraries provide core functionality such as slugification, query running with timeout and retry, attribute suggestion, CSV export, and data stores.
- The roadmap and vision documents define the product vision, core value propositions, and prioritized tasks including features, improvements, and bug fixes.
- Tests and audit documents are present, covering integration, API, UI, and observability aspects.

TOP_MILESTONE
Dashboard

TASKS
Title: Attribute Groups Search (filters & pagination)
Rationale: Provide a searchable API and admin UI for attribute groups with filtering by code, label, type, and required status, plus server-side pagination to handle large datasets efficiently.
Acceptance: API supports query parameters for filters and pagination; admin UI displays filtered and paginated results; robust error handling; API and UI tests included; documentation updated.
Files: pages/api/attribute-groups/search.js, pages/admin/attribute-groups-search.js, src/api/attributeGroups.ts, tests/api-attributeGroups.test.js
Tests: API endpoint tests for filters and pagination; UI tests for search input, filter controls, and result rendering.

Title: Filtered CSV Export for Products
Rationale: Ensure product CSV exports respect current list filters (search, tags, in-stock) and pagination for accurate data extraction matching the admin view.
Acceptance: Export endpoints accept filter parameters; CSV output matches filtered product list; admin export link updates with filters; tests validate CSV content correctness.
Files: pages/api/products/export.js, pages/admin/products.js, components/ExportCsvLink.js, tests/api-products-export.test.js
Tests: Export endpoint tests with various filters; UI tests for export link behavior and CSV content verification.

Title: Bulk Tagging Preview and Apply in Admin UI
Rationale: Enable bulk tagging workflow with preview of tag additions/removals for SKU lists before applying changes, improving admin efficiency and reducing errors.
Acceptance: API preview endpoint returns expected tag changes; admin UI allows input of SKUs and tags to add/remove; preview displays changes; batch apply updates tags; UI and API tests included.
Files: pages/api/products/tags/bulk-preview.js, pages/admin/bulk-tags.js, tests/api-products-bulk-tags.test.js
Tests: API preview correctness; UI form submission and preview display; batch apply operation tests.

Title: Dashboard with Key Product & Tag Metrics
Rationale: Provide an admin dashboard showing total products, in-stock counts, tag usage statistics, and recent activity with API aggregation, caching, and error handling.
Acceptance: Dashboard UI displays metrics and recent activity; API aggregates data efficiently; error states handled gracefully; tests cover API and UI.
Files: pages/api/dashboard.js, pages/admin/dashboard.js, src/api/dashboardHandler.js, tests/api-dashboard.test.js
Tests: API aggregation correctness; UI rendering and error handling tests.

Title: Query duration exceeded (long-running queries terminated)
Rationale: Investigate and fix long-running queries terminated after 5-minute cap by capturing slow queries, adding indexes, filters, pagination, and safeguards to improve reliability.
Acceptance: Slow queries identified and optimized; indexes added or migrated; queries support pagination or batching; timeouts and retries implemented; regression tests added.
Files: src/db/queryRunner.ts, lib/api/withTimeout.js, lib/db.ts, tests/db-queryRunner.test.ts
Tests: Performance tests for query duration; timeout and retry behavior tests; regression tests for query correctness.

DONE_UPDATES
- Created vendor-neutral PIM vision.md with UX and dashboards focus.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI and commands.
- Implemented wrappers for deployment and runtime logs.
- Added GitHub upsert helpers using Octokit.
- Added markdown helpers for fenced YAML blocks.
- Added lock and state mechanisms to avoid thrashing.
- Added prompts for log to bugs, review to ideas, task synthesis, and plan implementation.
- Delivered Operations Overview dashboard with KPIs and widgets.
- Delivered Data Quality dashboard with heatmap and rule leaderboard.
- Delivered Global search with advanced filters and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component.