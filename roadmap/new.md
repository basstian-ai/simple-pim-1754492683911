REPO_SUMMARY
This repository hosts a modern, vendor-neutral Product Information Management (PIM) platform focused on managing, enriching, and distributing product data efficiently. It includes a React/Next.js frontend with admin pages for managing products, attribute groups, tags, and dashboards. The backend exposes REST API endpoints for products, attributes, attribute groups, tags, and AI-assisted suggestions. The project emphasizes accessibility, performance, observability, and extensibility with features like bulk tagging, variant matrix editing, completeness rule building, and channel mapping. It also includes health and readiness endpoints, automated accessibility checks, and comprehensive dashboards for operations and data quality.

STRUCTURE_FINDINGS
- The project uses Next.js with pages organized under /pages for both public and admin interfaces.
- API routes are under /pages/api with endpoints for products, attributes, attribute groups, tags, AI suggestions, health, and dashboard data.
- Admin UI components and pages cover attribute groups, products, bulk tagging, variant generation, dashboards, and AI tools.
- Data files such as products.json and attribute-groups.json reside in /data for static or fallback data loading.
- There are utilities and libraries for slugifying, attribute suggestion, product services, query running with timeouts, and CSV export.
- Testing is present with Jest and React Testing Library, including accessibility audits and UI tests.
- Roadmap and task management files are in /roadmap with detailed YAML task definitions and a stable vision.md for product direction.

TOP_MILESTONE
Dashboard

TASKS
Title: Accessibility audit and fixes for admin UI
Rationale: Ensure key admin pages meet accessibility standards (ARIA, keyboard focus, color contrast) and integrate automated accessibility checks into CI for ongoing compliance.
Acceptance: Admin pages pass automated a11y tests; manual keyboard and screen reader testing confirm usability; CI runs a11y checks on pull requests.
Files: pages/admin/*, components/*, test/*, audits/*
Tests: Automated accessibility tests using axe-core and jest-axe; manual test scripts documented.

Title: Long-running queries hit 5-minute execution cap (BUG-dpl_HK-1755266967960)
Rationale: Prevent runtime errors and incomplete results caused by queries exceeding execution time limits by optimizing queries and adding pagination or batching.
Acceptance: Queries complete within time limits; logs capture EXPLAIN plans on timeout; no user-facing errors for long queries.
Files: src/lib/db.ts, pages/api/products/*.js, scripts/check-duplicate-server.js
Tests: Integration tests simulating long queries; monitoring/logging of query durations.

Title: Long-running queries hit 5-minute execution cap (BUG-dpl_8G-1755344862515)
Rationale: Address additional query timeouts by reviewing plans, adding indexes, and batching work to improve reliability.
Acceptance: Queries optimized to run under 5 minutes; monitoring shows no new timeouts; error rates reduced.
Files: src/lib/db.ts, pages/api/products/*.js
Tests: Query performance tests; logs and metrics validation.

Title: Data Quality dashboard
Rationale: Provide visibility into product completeness by channel, locale, and category with rule leaderboards and drill-downs to problematic products.
Acceptance: Dashboard UI displays completeness metrics; drill-downs link to affected products; API endpoints support dashboard data.
Files: pages/admin/dashboard.js, pages/api/dashboard.js, lib/api/dashboardHandler.js
Tests: UI tests for dashboard rendering; API tests for data accuracy.

Title: Global Search with advanced filters and saved views
Rationale: Enable powerful product search with filters by attributes, tags, stock status, and support saving and sharing filter views.
Acceptance: Search UI supports filters and saved views; URL sync works; API supports performant search queries.
Files: pages/index.js, pages/admin/products.js, src/components/ProductFilters.tsx, src/routes/adminProducts.js
Tests: End-to-end tests for search and filter functionality; API response validation.

Title: Variant Matrix Editor with bulk actions and undo
Rationale: Facilitate editing product variants in a matrix layout with bulk updates and undo/redo capabilities for efficient management.
Acceptance: Variant editor UI supports matrix display, bulk edits, and undo; changes persist correctly.
Files: pages/admin/variant-generator.js, lib/variants.js, components/VariantMatrixEditor.js (to be created)
Tests: UI interaction tests; state management tests for undo/redo.

Title: Completeness Rule Builder UI component
Rationale: Allow users to define and validate completeness and consistency rules with inline validation and remediation workflows.
Acceptance: Rule builder UI allows creating/editing rules; validation errors display with explanations; quick-fix actions available.
Files: components/CompletenessRuleBuilder.js, pages/admin/rule-builder.js (to be created)
Tests: Component unit tests; integration tests with validation logic.

Title: Channel Mapping UI with transformers and dry-run preview
Rationale: Provide a visual editor for mapping PIM attributes to channel payloads with transformation snippets and JSON preview for export accuracy.
Acceptance: Channel mapping UI supports attribute mapping and transformations; dry-run preview shows expected JSON output.
Files: components/ChannelMappingUI.js, pages/admin/channel-mapping.js (to be created)
Tests: UI tests for mapping interactions; API tests for transformation logic.

Title: Bulk Tagging UI + preview & apply endpoints
Rationale: Implement bulk tagging with preview and reversible apply operations to manage tags efficiently and safely.
Acceptance: Bulk tagging UI supports SKU input, tag add/remove; preview shows changes; apply endpoint updates tags; operations are cancelable.
Files: pages/admin/bulk-tags.js, pages/api/products/tags/bulk-preview.js
Tests: End-to-end tests for bulk tagging flows; API tests for preview and apply.

Title: AI-assisted attribute & name suggestions improvements
Rationale: Enhance AI suggestion endpoints and admin previews with better prompts, confidence scoring, and UX for accepting suggestions.
Acceptance: AI endpoints return improved