# REPO_SUMMARY
- This repository is a Product Information Management (PIM) platform focused on managing product data with features like attribute groups, product variants, tags, and filters.
- It includes an admin interface with pages for managing attributes, attribute groups, products, tags, and bulk operations.
- The API layer provides REST endpoints for products, attributes, attribute groups, tags, and health/status checks.
- The platform supports CSV export of filtered product and attribute data, with URL-synced filters for reproducibility.
- There are tools and utilities for slug generation, SKU generation, AI-based attribute suggestions, and query running with timeout and retry.
- The vision emphasizes dashboards, data quality, governance, publishing, collaboration, extensibility, and a keyboard-first accessible UX.
- The codebase uses React with Next.js for frontend and API routes, and includes testing with Jest.

# STRUCTURE_FINDINGS
- Top-level directories include: pages (Next.js pages and API routes), components (UI components), lib (business logic and helpers), data (static JSON data), docs, audits, and src (likely shared or newer code).
- API routes under `pages/api/` cover products, attributes, attribute-groups, tags, health checks, AI suggestions, and exports.
- Admin UI pages under `pages/admin/` provide management for products, attribute groups (including flat, grouped, duplicates views), bulk tagging, variant generation, and dashboards.
- CSV export endpoints exist for products, attribute groups, and tags.
- The repo contains utilities for query running with timeout/retry, slugify, SKU generation, and attribute suggestion.
- Testing files are present for API endpoints and UI components.
- Protected paths include vision.md and roadmap/vision.md which contain the product vision and roadmap.

# TOP_MILESTONE
CRUD Admin

# TASKS
- Title: Implement Full CRUD for Attribute Groups via API and Admin UI  
  Rationale: Attribute groups are core to organizing product attributes; full create, read, update, and delete operations are essential for admin users to manage product metadata effectively.  
  Acceptance:  
    - API endpoints support GET, POST, PUT, DELETE for attribute groups with validation and error handling.  
    - Admin UI pages allow creating new groups, editing existing groups, and deleting groups with confirmation.  
    - Changes persist and reflect immediately in the UI and API responses.  
  Files:  
    - `pages/api/attribute-groups/[id].js` (update and delete handlers)  
    - `pages/api/attribute-groups/index.js` (list and create)  
    - `pages/admin/attribute-groups.js` (admin UI for listing and editing)  
    - `components/AttributeGroupsEditor.js` (UI component for editing groups)  
  Tests:  
    - API tests for attribute groups CRUD operations  
    - UI tests for attribute groups admin pages  

- Title: Enhance Admin Products Page with Filters and CSV Export  
  Rationale: Admin users need to filter products by name, SKU, tags, and stock status, and export filtered results for offline use or integration.  
  Acceptance:  
    - Filters for search, tags, and in-stock toggle are synced to URL query parameters.  
    - CSV export link reflects current filters and downloads matching products.  
    - Product list updates reactively with filter changes.  
  Files:  
    - `pages/admin/products.js` (admin products page)  
    - `components/PimAdminProductList.js` (product list component)  
    - `components/ExportCsvLink.js` (CSV export link component)  
    - `pages/api/products/export.js` (CSV export API)  
  Tests:  
    - Integration tests for filter state syncing and CSV export correctness  

- Title: Implement Attribute Groups Flat and Grouped Views with Export  
  Rationale: Different views of attribute groups help admins audit and manage attributes effectively; CSV export supports offline analysis.  
  Acceptance:  
    - Flat view lists all attributes across groups in a single table.  
    - Grouped view shows attributes nested by group with expand/collapse.  
    - Export CSV endpoints provide downloads for both views.  
  Files:  
    - `pages/admin/attribute-groups-flat.js`  
    - `pages/admin/attribute-groups-grouped.js`  
    - `pages/api/attribute-groups/flat/export.js`  
    - `pages/api/attribute-groups/export.js`  
  Tests:  
    - API tests for export endpoints  
    - UI tests for flat and grouped views  

- Title: Add Bulk Tagging Preview and Application in Admin UI  
  Rationale: Bulk tagging improves productivity by allowing batch updates to product tags with preview before applying changes.  
  Acceptance:  
    - Admin page to input SKUs and tags to add/remove with preview of changes.  
    - Preview shows expected tag changes without persisting.  
    - Option to apply changes in bulk after preview.  
  Files:  
    - `pages/admin/bulk-tags.js`  
    - `pages/api/products/tags/bulk-preview.js`  
  Tests:  
    - API tests for bulk preview logic  
    - UI tests for bulk tagging page  

- Title: Implement Dashboard with Key Product and Tag Metrics  
  Rationale: Dashboards provide visibility into product catalog health and tag usage to support data quality and operational decisions.  
  Acceptance:  
    - Dashboard page shows total products, in-stock counts, tag statistics, and recent activity.  
    - Data fetched from API endpoints with caching and error handling.  
  Files:  
    - `pages/admin/dashboard.js`  
    - `pages/api/dashboard.js`  
  Tests:  
    - API tests for dashboard data aggregation  
    - UI tests for dashboard rendering and error states  

# DONE_UPDATES
- Vision document established