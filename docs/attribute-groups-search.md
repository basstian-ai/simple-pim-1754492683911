# Attribute Groups Search

This document describes the server-side attribute groups search endpoint and the in-service search helper.

API (example)
GET /api/attribute-groups?code=color&label=colo&type=select&required=true&page=1&pageSize=10

Query parameters
- code: substring match on attribute group code (case-insensitive)
- label: substring match on label (case-insensitive)
- type: exact match on type (eg. "text", "number", "select", "boolean")
- required: true|false
- page: integer >= 1 (defaults to 1)
- pageSize: integer 1..100 (defaults to 10)

Response shape
{
  "items": [ /* AttributeGroup[] */ ],
  "total": 123,
  "page": 1,
  "pageSize": 10,
  "totalPages": 13
}

Notes
- The service included here is an in-memory implementation intended for local tests and as a clear reference for DB-backed implementations.
- Production should replace the in-memory dataset with a database query that applies equivalent filters and pagination at the DB layer for efficiency.
