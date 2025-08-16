REPO_SUMMARY
This repository implements a Product Information Management (PIM) platform focused on managing product data with features such as attribute groups, product variants, tags, and bulk operations. It includes an admin UI for managing products, attributes, and tags, as well as public APIs for product and attribute data. The platform supports CSV export, filtering, and bulk tagging workflows. It also provides dashboards for key metrics and health checks. The codebase uses React for frontend pages and components, Next.js API routes for backend endpoints, and includes utilities for query handling, slug generation, and attribute suggestion. The project emphasizes reliability, observability, extensibility, and user productivity.

STRUCTURE_FINDINGS
- The codebase is organized into top-level directories such as pages (Next.js pages and API routes), components (React UI components), lib (utility libraries), src (likely TypeScript/React components and services), data (static JSON data), and audits/docs for documentation and reviews.
- API routes under pages/api cover products, attributes, attribute-groups, tags, health checks, and AI-based suggestions.
- Admin UI pages under pages/admin provide interfaces for managing products, attribute groups, bulk tagging, dashboards, and AI tools.
- There are multiple views for attribute groups: flat, grouped, duplicates audit, and search with filters and pagination.
- CSV export functionality is implemented for products, tags, and attribute groups.
- The repo includes utilities and services for attribute groups, SKU generation, query running with timeout and retries, and slugification.
- Testing is present for components and API endpoints, including integration and UI tests.
- The project uses a milestone-driven roadmap with tasks prioritized by impact and dependencies.

TOP_MILESTONE
Dashboard

TASKS
Title: Filtered CSV Export for Products
Rationale: Ensure that CSV exports for products respect current list filters such as search terms, selected tags, in-stock status, and pagination to provide accurate and shareable data exports.
Acceptance: Export endpoints and admin UI export links reflect applied filters; tests validate CSV content matches filters.
Files: pages/api/products/export.js, pages/admin/products.js, components/ExportCsvLink.js
Tests: Integration tests for export endpoints and UI tests for export link behavior.

Title: Bulk Tagging Preview and Apply in Admin UI
Rationale: Provide a bulk-tagging workflow that allows previewing tag additions and removals for multiple SKUs before applying changes, improving user confidence and reducing errors.
Acceptance: API preview endpoint returns correct tag changes; UI supports input of SKUs and tags; tests cover preview and apply flows.
Files: pages/admin/bulk-tags.js, pages/api/products/tags/bulk-preview.js
Tests: UI tests for bulk tagging form and preview; API tests for bulk preview endpoint.

Title: Dashboard with Key Product & Tag Metrics
Rationale: Implement an admin dashboard showing total products, in-stock counts, tag usage statistics, and recent activity to give users operational insights.
Acceptance: Dashboard UI displays metrics with data from API aggregation; caching and error handling are implemented.
Files: pages/admin/dashboard.js, pages/api/dashboard.js, lib/api/dashboardHandler.js
Tests: Component tests for dashboard; API tests for metrics aggregation.

Title: Query Duration Exceeded (Long-Running Queries Terminated)
Rationale: Investigate and fix issues where queries exceed the 5-minute execution cap, causing termination and failures.
Acceptance: Slow queries are identified with EXPLAIN plans; indexes and filters added; timeouts, cancellations, and retries implemented; regression tests added.
Files: src/db/queryRunner.ts, lib/api/withTimeout.js, pages/api/products/search.js
Tests: Regression tests for query timeouts and retries.

Title: Attribute Groups Search (Filters & Pagination)
Rationale: Provide a searchable API and admin UI for attribute groups with filters on code, label, type, and required status, including server-side pagination for scalability.
Acceptance: API supports filters and pagination; admin UI integrates search and filter controls; tests cover API and UI behavior.
Files: pages/api/attribute-groups/search.js, pages/admin/attribute-groups.js, src/api/attributeGroups.ts
Tests: API endpoint tests for search; UI tests for attribute groups admin page.

DONE_UPDATES
- Created vendor-neutral PIM vision.md focusing on UX and dashboards.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI and commands.
- Implemented wrappers for deployment and runtime logs.
- Added GitHub upsert helpers using Octokit.
- Added markdown helpers for fenced YAML blocks.
- Added lock and state mechanisms to avoid thrashing.
- Added prompts for log-to-bug, review-to-ideas, task synthesis, and implementation planning.
- Delivered Operations Overview dashboard with KPIs and widgets.
- Delivered Data Quality dashboard with heatmap and rule leaderboard.
- Delivered Global search with advanced filters and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component.