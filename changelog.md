# Changelog

All notable changes to this project will be a document in this file.

The format is based on Keep a Changelog (https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning (https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dashboard API and Admin Dashboard page with product stats and top tags.
- Product search suggestions API.
- CSV export for tags via `/api/tags/export` and a quick link on the home page.
- AI Product Name Suggestion API and UI page.
- Shareable URL filters (search, tags, inStock) to product list and new `/tags` page for browsing tags.
- Attribute Groups (API + simple admin UI).
- In-stock filter to product listing (UI + API).
- Product detail API and page by SKU.
- Product stats API and UI summary.
- Product-based attribute suggestion API and admin UI.
- Tag filtering support to `/api/products`.
- Tag-based product filtering (API + UI).
- Client-side Attribute Groups admin page at `/admin/attribute-groups` with localStorage persistence.
- Flat attributes CSV export at `/api/attribute-groups/flat/export`.
- Bulk Tagging Preview API `/api/products/tags/bulk-preview` and admin page `/admin/bulk-tags`.
