# Simple PIM (Next.js)

This is a lightweight Product Information Management (PIM) demo built with Next.js and deployed on Vercel. It includes sample data, APIs for products, tags, attributes, attribute groups, and a minimal admin UI.

## Quick start

- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Run tests: `npm test`

## Notable features

- Product search, tag filtering, and CSV export on the storefront (home page)
- Admin dashboard with product stats and tools
- Attributes and Attribute Groups management and exports
- Flat Attribute Groups browser with CSV export at `/admin/attribute-groups-flat`
- Grouped Attribute Groups browser with per-group counts at `/admin/attribute-groups-grouped`
- Attribute Duplicates audit page to find conflicting attribute codes across groups at `/admin/attribute-groups-duplicates`
- Attribute Search across all groups at `/admin/attribute-groups-search` (uses `/api/attribute-groups/search`)
- Tag stats and bulk tag tools
- Variant generation helpers
- Per-product flat attributes viewer at `/admin/product/[sku]/attributes` (uses `/api/products/[sku]/attributes/flat`)

## New: Admin Products filters and CSV export

The Admin Products page now mirrors the storefront filtering experience:

- Search by name, SKU, or description
- Filter by tags and in-stock only
- CSV export link that always reflects the current filters
- All filters are synced to the URL for easy sharing and reproducible exports

You can find it at `/admin/products`.

## API

Explore the API routes under `/pages/api/*`. Common ones include:

- `/api/products`, `/api/products/[sku]`, `/api/products/search`, `/api/products/export`
- `/api/products/[sku]/attributes/flat` (flatten a product's Attribute Groups for easy export/inspection)
- 
- `/api/tags`, `/api/tags/stats`, `/api/tags/export`
- `/api/attributes`, `/api/attributes/suggest`
- `/api/attribute-groups`, `/api/attribute-groups/flat`, `/api/attribute-groups/export`, `/api/attribute-groups/grouped`
- `/api/attribute-groups/duplicates` returns attribute codes that appear in multiple groups, with group counts
- New: `/api/attribute-groups/search` returns flattened attributes across all groups with filters (q, type, required, groupId)

## Testing

This project uses Jest and Testing Library. When adding features, ensure you:

- Cover new behavior with tests
- Keep the main branch green (tests and build passing)

Run tests with `npm test`.
