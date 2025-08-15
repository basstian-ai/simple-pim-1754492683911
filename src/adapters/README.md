Adapters module

This module provides a minimal, versioned adapter surface for import/export of product data.

Key pieces:
- types.ts - shared Product type and adapter interfaces (ImportAdapter / ExportAdapter)
- adapterRegistry.ts - small registry for discovering adapters by name+version
- csvAdapter.ts - example CSV adapter (1.0.0)
- jsonAdapter.ts - example JSON adapter (1.0.0)

Design notes / extension points:
- Adapters are registered by name and adapterVersion. Resolve without a version returns the highest adapterVersion (lexicographically).
- Adapters should be pure functions from bytes -> Product[] and vice-versa (or support async streams where appropriate).
- For production, replace the naive CSV parser with a tested parser (e.g. csv-parse) and add streaming for large files.
- Consider adding capability flags (e.g. supportsStreaming) and adaptive schema negotiation using schemaVersion.
