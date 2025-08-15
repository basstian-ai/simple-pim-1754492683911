# Query Runner

Small helper to run queries with per-attempt timeouts and retries. Designed to help "graceful handling for long queries" by ensuring long-running operations are canceled (via AbortSignal) per attempt and retried with backoff.

Usage:

const { runWithTimeoutRetry } = require('./src/queryRunner');

await runWithTimeoutRetry(async ({ signal, attempt }) => {
  // your query logic here; if possible, respond to signal.aborted or signal 'abort' event
}, { attempts: 3, perAttemptTimeout: 2000 });

API notes:
- queryFn({ signal, attempt }) should accept an AbortSignal and cancel in-progress work when signal is aborted. Many fetch/http libraries accept AbortSignal.
- On final failure a TimeoutError is thrown with metadata (attempts, perAttemptTimeout, lastError).


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

## Progress & Tasks

- Roadmap items live in `/roadmap/*.md` (`new.md`, `tasks.md`, `done.md`, `bugs.md`).
- Automation and build artifacts are kept in `/audits/`.
- To validate a task, run simple checks like visiting an admin URL if provided or curling the related API endpoint.

### Canonical Vision
The canonical vision document is `./vision.md`. Avoid adding or editing `roadmap/vision.md`; that path is intentionally removed.

