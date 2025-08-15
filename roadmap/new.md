# REPO_SUMMARY
This repository implements a Product Information Management (PIM) platform with a focus on managing product data, attribute groups, tags, and variants. It provides both admin and public-facing interfaces, REST API endpoints, and tools for data quality, attribute suggestion, and CSV export. The platform supports filtering, searching, bulk tagging, and variant generation. It includes dashboards for operations and data quality, and AI-assisted tools for attribute and name suggestions. The codebase uses React for frontend pages and components, Next.js API routes for backend logic, and JSON files for sample data.

# STRUCTURE_FINDINGS
- The project is organized into top-level directories including `pages` (Next.js pages and API routes), `components` (React UI components), `lib` (core libraries and utilities), `data` (static JSON data), `tests` (test suites), and `docs` (documentation).
- The `pages/api` directory contains REST endpoints for products, attributes, attribute groups, tags, health checks, and AI suggestions.
- Admin UI pages under `pages/admin` provide interfaces for managing products, attribute groups (with flat, grouped, and duplicate views), bulk tagging, variant generation, and dashboards.
- Several tools exist under `pages/tools` for slugifying, name suggestion, and attribute suggestion.
- The platform supports CSV export for products, tags, and attribute groups.
- The `lib` folder contains core logic for attribute groups, products, CSV export, slugification, and query running with timeout and retry.
- The repository includes observability components and tests for UI and API functionality.

# TOP_MILESTONE
Dashboard

# TASKS
1. Title: Complete Operations Overview Dashboard Implementation  
   Rationale: The vision emphasizes shipping an Operations Overview dashboard early to provide KPIs like pending approvals, blockers, SLA health, and “My queue” for users. The existing admin dashboard page fetches stats but may need completion and integration with backend metrics.  
   Acceptance:  
   - Dashboard UI displays key operational metrics as per vision.  
   - Data is fetched from `/api/dashboard` and updates dynamically.  
   - Includes widgets for backlog, blockers, SLA health, and user queue.  
   - Error handling and loading states are implemented.  
   Files: `pages/admin/dashboard.js`, `pages/api/dashboard.js`, `lib/api/dashboardHandler.js`  
   Tests: UI tests for dashboard rendering and API tests for `/api/dashboard` endpoint.

2. Title: Implement Data Quality Dashboard with Rule Leaderboard and Heatmap  
   Rationale: Data quality insights are a core value proposition and an early dashboard to ship. This requires backend aggregation of completeness and rule conformance metrics and frontend visualization.  
   Acceptance:  
   - Backend API aggregates data quality metrics by channel, locale, and category.  
   - Frontend dashboard displays heatmap and rule leaderboard with drill-down links.  
   - Dashboard updates reflect current data and handle errors gracefully.  
   Files: `pages/admin/data-quality-dashboard.js` (to create), `pages/api/data-quality.js` (to create), relevant lib files for metrics aggregation.  
   Tests: API tests for data quality metrics, UI tests for dashboard components.

3. Title: Enhance Admin Products Page with Filter Sync and CSV Export  
   Rationale: The README notes new admin product filters synced to URL and CSV export reflecting filters. Ensuring this feature is robust and tested is critical for usability and data export.  
   Acceptance:  
   - Filters for name, SKU, description, tags, and in-stock status are synced with URL query parameters.  
   - CSV export link generates CSV matching current filters.  
   - UI updates filter state from URL on load and updates URL on filter changes.  
   Files: `pages/admin/products.js`, `components/ExportCsvLink.js`, `pages/api/products/export.js`  
   Tests: Integration tests for filter sync and CSV export correctness.

4. Title: Implement Attribute Groups Management with CRUD and Validation  
   Rationale: Attribute groups are foundational for product data modeling. Admin pages and API endpoints exist but require full CRUD support with validation and error handling.  
   Acceptance:  
   - Admin UI supports creating, editing, deleting attribute groups and attributes.  
   - API endpoints validate payloads and handle conflicts/errors properly.  
   - Local storage fallback and server data loading are supported.  
   Files: `pages/admin/attribute-groups.js`, `pages/api/attribute-groups/[id].js`, `lib/attributeGroups.js`  
   Tests: API tests for CRUD operations, UI tests for attribute group editor.

5. Title: Add AI-Assisted Attribute Suggestion Tool Integration  
   Rationale: AI tools for attribute suggestion enhance user productivity. The repo includes API and UI for attribute suggestion from product descriptions. Completing and polishing this feature aligns with extensibility and collaboration goals.  
   Acceptance:  
   - UI tool accepts product description input and displays attribute suggestions.  
   - Backend AI suggestion API returns structured attribute suggestions.  
   - Error and loading states are handled.  
   Files: `pages/tools/attribute-suggest.js`, `pages/api/attributes/suggest.js`, `lib/attributeSuggest.js`  
   Tests: API tests for suggestion endpoint, UI tests for attribute suggestion tool.

# DONE_UPDATES
- Vision document (`vision.md`) defines a comprehensive PIM product vision with focus on dashboards, unified workspace, data quality, publishing, collaboration, and extensibility.  
- Admin Products page enhanced with filters (name, SKU, description, tags, in-stock) synced to URL and CSV export reflecting filters.  
- API endpoints for products, attribute groups, tags, and health checks implemented with caching and CORS headers.  
- Attribute groups views implemented: flat, grouped, duplicates audit with CSV export.  
- Query runner helper added for timeout and retry of long