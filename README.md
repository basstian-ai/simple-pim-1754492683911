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
- Tag stats and bulk tag tools
- Variant generation helpers

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
- `/api/tags`, `/api/tags/stats`, `/api/tags/export`
- `/api/attributes`, `/api/attributes/suggest`
- `/api/attribute-groups`, `/api/attribute-groups/flat`, `/api/attribute-groups/export`

## Testing

This project uses Jest and Testing Library. When adding features, ensure you:

- Cover new behavior with tests
- Keep the main branch green (tests and build passing)

Run tests with `npm test`.
