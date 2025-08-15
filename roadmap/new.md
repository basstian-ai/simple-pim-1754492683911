REPO_SUMMARY
This repository implements a Product Information Management (PIM) platform with a focus on managing product data, attributes, tags, and variants. It includes an admin UI for managing attribute groups, products, tags, and bulk tagging workflows. The platform provides REST API endpoints for CRUD operations on attribute groups, product search, export, and attribute suggestions. It also features dashboards for product and tag metrics, AI-powered attribute and name suggestion tools, and utilities for slug generation and SKU creation. The codebase uses React for the frontend pages and components, Next.js API routes for backend logic, and includes testing and observability support. The project emphasizes reliability, performance, accessibility, and extensibility.

STRUCTURE_FINDINGS
- The codebase is organized into top-level directories such as pages (frontend and API routes), components (React UI components), lib (business logic and utilities), data (static JSON data), and tests.
- API routes under /pages/api cover attribute groups, products, tags, AI suggestions, health checks, and export functionality.
- Admin UI pages under /pages/admin provide interfaces for managing attribute groups (including flat, grouped, duplicates views), products (with filters and CSV export), bulk tagging, variant generation, and dashboards.
- Utilities and libraries handle attribute group loading, validation, slugification, SKU generation, query running with timeouts and retries, and CSV export.
- The roadmap and vision documents define milestones and tasks focused on CRUD operations, filtering, export, bulk tagging, and dashboard implementation.
- Testing is present for API endpoints, UI components, and query runner utilities.
- The project uses React hooks extensively for state management and data fetching with cancellation support.

TOP_MILESTONE
CRUD Admin

TASKS
Title: Full CRUD for Attribute Groups (API + Admin UI)
Rationale: Complete create, read, update, and delete operations for attribute groups to enable full lifecycle management. This is foundational for managing product attributes effectively.
Acceptance: API endpoints support all CRUD operations with validation and error handling; Admin UI pages reflect changes immediately; tests cover API and UI correctness.
Files: pages/api/attribute-groups/[id].js, pages/admin/attribute-groups.js, lib/attributeGroups.js, components/AttributeGroupsEditor.js
Tests: tests/manual/attribute-groups-api.test.js, pages/admin/attribute-groups.test.js

Title: Enhance Admin Products Page with Filters & CSV Export
Rationale: Improve product management by adding search, tag filtering, in-stock toggle, and CSV export that respects current filters. This enhances usability and data export capabilities.
Acceptance: Admin products page supports reactive filters synced with URL; CSV export endpoint reflects filters; integration tests verify filter and export correctness.
Files: pages/admin/products.js, components/PimAdminProductList.js, pages/api/products/search.js, pages/api/products/export.js
Tests: tests/adminProductsUrlSync.test.js, tests/api-products-search.test.js

Title: Attribute Groups Flat and Grouped Views + Export
Rationale: Provide multiple UI views (flat and grouped) for attribute groups with expand/collapse and CSV export endpoints to support auditing and offline analysis.
Acceptance: Admin UI pages for flat and grouped views are functional; CSV export endpoints deliver correct data; tests verify data integrity and UI behavior.
Files: pages/admin/attribute-groups-flat.js, pages/admin/attribute-groups-grouped.js, pages/api/attribute-groups/flat.js, pages/api/attribute-groups/grouped.js, pages/api/attribute-groups/flat/export.js
Tests: tests/api-attribute-groups-flat.test.js

Title: Bulk Tagging Preview and Apply in Admin UI
Rationale: Enable batch tagging workflows with preview of tag additions/removals before applying changes to multiple SKUs, improving efficiency and reducing errors.
Acceptance: Admin UI supports bulk tag input and preview; API endpoint for bulk preview works correctly; UI tests cover workflow scenarios.
Files: pages/admin/bulk-tags.js, pages/api/products/tags/bulk-preview.js
Tests: tests/api-products-tags-bulk-preview.test.js

Title: Dashboard with Key Product & Tag Metrics
Rationale: Implement an admin dashboard showing total products, in-stock counts, tag usage stats, and recent activity to provide operational insights.
Acceptance: Dashboard UI displays metrics with API aggregation and caching; error handling is robust; tests verify data correctness and UI rendering.
Files: pages/admin/dashboard.js, pages/api/dashboard.js, lib/api/dashboardHandler.js
Tests: tests/api-dashboard.test.js

DONE_UPDATES
- Created vendor-neutral PIM vision.md with UX and dashboard focus.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI commands.
- Implemented wrappers for deployment and runtime logs.
- Added GitHub upsert helpers using Octokit.
- Added markdown helpers for fenced YAML blocks.
- Added lock and state mechanisms to avoid thrashing.
- Added prompts for log to bug conversion, review to ideas, task synthesis, and implementation planning.
- Implemented Operations Overview dashboard with KPIs and widgets.
- Added Data Quality dashboard with heatmap and rule leaderboard.
- Implemented global search with advanced filters and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component and tests.