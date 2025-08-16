REPO_SUMMARY
This repository implements a Product Information Management (PIM) platform focused on managing product data with features including attribute groups, product filtering, bulk tagging, dashboards, and CSV export. It provides both admin UI pages and public API endpoints for products, attributes, tags, and attribute groups. The system supports complex filtering, search, and export capabilities, with a focus on reliability, observability, and extensibility. The codebase includes React components for UI, Next.js API routes, and various utility libraries for data handling, query running with timeouts, and slug/sku generation.

STRUCTURE_FINDINGS
- The project is organized into top-level directories such as pages (Next.js pages and API routes), components (React UI components), lib (utility libraries), data (static JSON data), and roadmap (planning and task tracking).
- There are duplicate directories for server code under both `server` and `src/server`, and for routes under `src/routes` and `src/server/routes`.
- API routes are grouped under `pages/api/` with subfolders for attribute-groups, products, tags, ai, and admin.
- Admin UI pages are under `pages/admin/` with features for products, attribute groups, bulk tags, dashboard, and AI tools.
- The codebase includes utilities for query running with timeout and retries, attribute group management, slug and SKU generation, and CSV export.
- The roadmap and task management files are maintained in `roadmap/` with tasks, bugs, and done lists in markdown and YAML formats.
- The vision document outlines a vendor-neutral PIM platform with dashboards, data quality, publishing, collaboration, extensibility, and UX principles.

TOP_MILESTONE
Dashboard

TASKS
Title: Filtered CSV Export for Products
Rationale: Ensure CSV exports for products respect current list filters and pagination to provide accurate data exports matching user views.
Acceptance: Export endpoints and admin export links reflect applied filters; tests validate CSV contents match filters.
Files: pages/admin/products.js, pages/api/products/export.js, lib/exportCsv.js
Tests: Integration tests for export endpoints and UI tests for export link behavior.

Title: Bulk Tagging Preview and Apply in Admin UI
Rationale: Provide a workflow to preview bulk tag changes on SKUs before applying, reducing errors and improving admin efficiency.
Acceptance: API preview endpoint implemented; UI allows preview and batch apply; tests cover preview and apply flows.
Files: pages/admin/bulk-tags.js, pages/api/products/tags/bulk-preview.js
Tests: API and UI tests for bulk tagging preview and apply.

Title: Dashboard with Key Product & Tag Metrics
Rationale: Deliver an admin dashboard showing product counts, stock status, tag usage, and recent activity to provide operational insights.
Acceptance: Dashboard UI implemented with API aggregation, caching, error handling; tests cover data correctness and error states.
Files: pages/admin/dashboard.js, pages/api/dashboard.js, lib/api/dashboardHandler.js
Tests: API and UI tests for dashboard metrics and error handling.

Title: Investigate and Fix Long-Running Query Terminations
Rationale: Address query terminations due to 5-minute execution cap by optimizing queries and adding safeguards.
Acceptance: Slow queries identified with EXPLAIN plans; indexes added or queries optimized; timeouts, cancellations, retries implemented; regression tests added.
Files: lib/db.ts, src/db/queryRunner.ts, pages/api/products/search.js
Tests: Regression tests for query timeouts and retries.

Title: Attribute Groups Search with Filters and Pagination
Rationale: Provide searchable API and admin UI for attribute groups with filters and pagination for better manageability.
Acceptance: API supports filters (code, label, type, required) and pagination; admin UI integrates search and pagination; tests cover API and UI.
Files: pages/api/attribute-groups/search.js, pages/admin/attribute-groups.js
Tests: API and UI tests for search filters and pagination.

DONE_UPDATES
- Created vendor-neutral PIM vision.md with UX and dashboards focus.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI commands.
- Implemented Vercel and GitHub API wrappers.
- Added markdown helpers and locking mechanisms.
- Added prompts for log to bugs, review to ideas, task synthesis, and implementation planning.
- Delivered Operations Overview dashboard with KPIs and widgets.
- Delivered Data Quality dashboard with heatmap and rule leaderboard.
- Implemented global search with advanced filters and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component.

