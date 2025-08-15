REPO_SUMMARY
This repository is a Product Information Management (PIM) platform focused on managing product data with features for attribute groups, products, tags, and dashboards. It includes an admin UI with filtering, bulk tagging, CSV export, and attribute suggestion tools. The backend provides REST endpoints for products, attributes, attribute groups, tags, and health checks. The system supports query timeouts, retries, and graceful failure handling for long-running queries. The frontend is built with React and Next.js, emphasizing accessibility, performance, and keyboard-first UX. The repo also contains utilities for slug generation, SKU generation, and AI-based attribute and name suggestions.

STRUCTURE_FINDINGS
- The project is organized into directories such as pages (Next.js pages and API routes), components (React UI components), lib (core logic and utilities), data (static JSON data), and tests.
- API routes under pages/api provide endpoints for products, attributes, attribute groups, tags, health checks, and AI suggestions.
- Admin UI pages under pages/admin include product management, attribute groups (with multiple views), bulk tagging, dashboards, and AI tools.
- The lib directory contains core logic for attribute groups, product data handling, query running with timeout/retry, and CSV export.
- There are multiple React components for admin product lists, attribute group editors, export links, and UI widgets like stock filters and dashboards.
- The roadmap directory contains task definitions, bug tracking, and done items, with tasks prioritized and described in YAML format.
- The vision.md file defines a vendor-neutral PIM vision emphasizing dashboards, unified product workspace, data quality, publishing, collaboration, extensibility, and frontend UX principles.

TOP_MILESTONE
Dashboard

TASKS
Title: Investigate and Fix Long-Running Query Termination
Rationale: Long-running queries are being terminated after a 5-minute execution cap, causing failures and degraded user experience. Fixing this will improve reliability and performance.
Acceptance: Capture slow query text and EXPLAIN plans; add or migrate indexes; implement filters, pagination, or batch processing; add safeguards such as timeouts, cancellations, and retries; include regression tests verifying fixes.
Files: lib/db.ts, src/db/queryRunner.ts, pages/api/products/search.js, tests/api-products-search.test.js
Tests: Regression tests for query duration limits and cancellation behavior.

Title: Implement Bulk Tagging Preview and Apply in Admin UI
Rationale: Users need a workflow to preview tag additions/removals for multiple SKUs before applying changes in batch, improving efficiency and reducing errors.
Acceptance: Provide an API preview endpoint; build UI for bulk tagging preview and apply; include UI tests covering the workflow.
Files: pages/admin/bulk-tags.js, pages/api/products/tags/bulk-preview.js, components/DryRunPreview.tsx
Tests: UI tests for bulk tagging preview and application.

Title: Build Dashboard with Key Product and Tag Metrics
Rationale: A dashboard showing total products, in-stock counts, tag usage stats, and recent activity will provide valuable insights and operational overview.
Acceptance: Implement API aggregation with caching and error handling; build dashboard UI with KPIs and widgets; ensure data accuracy and responsiveness.
Files: pages/admin/dashboard.js, pages/api/dashboard.js, lib/api/dashboardHandler.js, components/Stat.js
Tests: Integration tests for dashboard API and UI rendering.

Title: Add Attribute Groups Search with Filters and Pagination
Rationale: Users need to search and filter attribute groups by code, label, type, and required status to efficiently manage attributes.
Acceptance: Implement API endpoint supporting search and filters; build admin UI page with search inputs and paginated results; include error handling.
Files: pages/admin/attribute-groups-search.js, pages/api/attribute-groups/search.js, src/api/attributeGroups.ts
Tests: API and UI tests for search functionality.

Title: Enhance Product Export with Filtered CSV Support
Rationale: Exporting products with current filters applied improves data sharing and reporting capabilities.
Acceptance: Ensure CSV export endpoints reflect current filters (search, tags, in-stock); update export links in admin UI; validate CSV content matches filtered data.
Files: pages/api/products/export.js, pages/admin/products.js, components/ExportCsvLink.js
Tests: Tests verifying CSV export correctness and filter synchronization.

DONE_UPDATES
- Created vendor-neutral PIM vision.md with UX/dashboards focus.
- Defined roadmap file structure and YAML-in-Markdown convention.
- Drafted agent repo skeleton with CLI and commands.
- Implemented wrappers for deployment and runtime logs.
- Added GitHub upsert helpers using Octokit.
- Added markdown helpers for fenced YAML blocks.
- Added lock and state mechanisms to avoid thrash.
- Added prompts for log → bugs, review → ideas, task synthesis, and implement plan.
- Delivered Operations Overview dashboard with KPIs and widgets.
- Delivered Data Quality dashboard with heatmap and rule leaderboard.
- Delivered Global search with advanced filters and saved views.
- Added Variant Matrix Editor feature with tests.
- Added Completeness Rule Builder UI component.
- Added Channel Mapping UI and tests.
- Implemented Channel Mapping UI component.