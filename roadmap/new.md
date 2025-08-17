REPO_SUMMARY
This repository implements a modern, vendor-neutral Product Information Management (PIM) platform. It provides a unified product workspace with features such as attribute groups management, product filtering, variant generation, bulk tagging, and dashboards for operations and data quality. The platform includes a public API with endpoints for products, attributes, tags, and attribute groups, supporting search, export, and detailed views. The front-end is built with React and Next.js, focusing on accessibility, keyboard navigation, and performance. The system supports extensibility through modular import/export adapters and API contracts. It also includes tools for AI-based attribute and name suggestions, slug and SKU generation, and health/readiness checks.

STRUCTURE_FINDINGS
- The repository contains a comprehensive API under the `/pages/api/` directory with endpoints for products, attributes, attribute groups, tags, health checks, and AI suggestions.
- Admin UI pages under `/pages/admin/` cover attribute groups management, product listing with filters and CSV export, bulk tagging, variant generation, dashboards, and AI tools.
- Components and UI logic are implemented in both `/components/` and `/src/components/` directories, with TypeScript usage evident in some parts.
- Data files such as `data/products.json` and `data/attribute-groups.json` serve as static data sources for the API and UI.
- Accessibility is a focus, with a dedicated audit task and usage of axe-core and jsdom in dev dependencies for automated accessibility testing.
- The roadmap and vision documents define the product vision, core value propositions, and a prioritized task list including bug fixes and improvements.
- Utility libraries and services for attribute groups, products, suggestions, and slug/SKU generation are implemented in `/lib/` and `/src/`.

TOP_MILESTONE
Dashboard

TASKS
Title: Accessibility audit and fixes for admin UI
Rationale: Ensure key admin pages meet accessibility standards (ARIA, keyboard focus, color contrast) to improve usability and compliance.
Acceptance: Run automated accessibility checks in CI; fix identified issues on products, attribute-groups, bulk-tags, and dashboard pages.
Files: pages/admin/products.js, pages/admin/attribute-groups.js, pages/admin/bulk-tags.js, pages/admin/dashboard.js, tests/a11y/runA11y.js
Tests: Automated accessibility tests using axe-core and jsdom integrated into CI pipeline.

Title: Investigate and fix long-running queries hitting 5-minute execution cap (BUG-dpl_HK-1755266967960)
Rationale: Queries exceeding the 5-minute limit cause runtime errors and incomplete results, affecting reliability.
Acceptance: Identify problematic queries via EXPLAIN/trace plans, add indexes or filters, implement pagination or batching, and capture diagnostics on timeout.
Files: lib/api/dashboardHandler.js, pages/api/products/search.js, pages/api/products/index.js
Tests: Integration tests verifying query timeouts are handled gracefully and performance improvements reduce query duration.

Title: Investigate and fix long-running queries hitting 5-minute execution cap (BUG-dpl_8G-1755344862515)
Rationale: Additional queries exceed execution limits causing failures and incomplete responses.
Acceptance: Review query plans, add pagination/batching or indexes, and add instrumentation to detect and prevent future long runs.
Files: lib/api/dashboardHandler.js, pages/api/products/search.js, pages/api/products/index.js
Tests: Integration tests for query performance and error handling on timeouts.

Title: Implement Operations Overview dashboard
Rationale: Provide visibility into pending approvals, blockers, SLA health, and user queues to improve operational efficiency.
Acceptance: Dashboard displays KPIs and widgets for backlog, blockers, SLA metrics, and user-specific queues.
Files: pages/admin/dashboard.js, pages/api/dashboard.js, src/routes/dashboard.js
Tests: UI tests verifying dashboard data loads correctly and displays expected metrics.

Title: Implement Data Quality dashboard
Rationale: Visualize completeness by channel/locale/category, rule leaderboards, and drill-downs to improve data governance.
Acceptance: Dashboard shows heatmaps, leaderboards, and detailed views of data quality issues.
Files: pages/admin/dashboard.js, pages/api/dashboard.js, src/routes/dashboard.js
Tests: UI and API tests validating data quality metrics and drill-down functionality.

Title: Add Global Search with advanced filters and saved views
Rationale: Enhance user productivity by enabling powerful search and filter capabilities with reusable saved views.
Acceptance: Search supports filtering by attributes, tags, and stock status; users can save and reuse filter configurations.
Files: pages/index.js, components/ProductFilters.tsx, src/utils/filterUrl.ts
Tests: Functional tests for search and filter behavior, including URL sync and saved views persistence.

Title: Implement Variant Matrix Editor with bulk actions and undo
Rationale: Facilitate efficient editing of product variants with bulk operations and undo support.
Acceptance: UI allows matrix editing of variants by attributes, supports bulk changes, and undo functionality.
Files: pages/admin/variant-generator.js, lib/variants.js, components/VariantMatrixEditor.js
Tests: UI tests for variant editing, bulk actions, and undo behavior.

Title: Add Completeness Rule Builder UI component
Rationale: Enable users to define data quality rules for completeness and consistency.
Acceptance: Rule builder supports channel and locale awareness, inline validation, and quick fixes.
Files: components/CompletenessRuleBuilder.tsx, pages/admin/rule-builder.js
Tests: Component tests for rule creation, validation, and UI interactions.

Title: Implement Channel Mapping UI with field transformers and dry-run preview
Rationale: Provide visual mapping from PIM attributes to channel payloads with transformation and preview capabilities.
Acceptance: UI supports mapping configuration, transformation snippets, and JSON dry-run previews.
Files: components/ChannelMappingUI.tsx, pages/admin/channel-mapping.js, lib/exportCsv.js
Tests: UI and integration tests for mapping configuration and preview accuracy.

Title: Add Bulk Tagging feature with preview and