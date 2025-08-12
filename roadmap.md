# Project Roadmap — PIM Platform

This repository implements a lightweight Product Information Management (PIM) platform focused on ease-of-use, a modern UI, and strong APIs. The file below outlines short-term priorities and a practical plan to improve stability, developer experience, and feature completeness.

Status: lightweight roadmap for the next milestones (early-stage).

## Goals (high level)
- Provide reliable, documented developer APIs for products, attributes and exports.
- Improve UX for common workflows: attribute modeling, bulk tagging, variant generation.
- Keep the platform simple and self-contained (no external dependencies required for core features).

## Near-term milestones 

1) Stabilize API surface and error handling
   - Audit API routes for consistent JSON responses and CORS where appropriate.
   - Ensure timeouts and safe error wrappers are applied (protect serverless functions).
   - Add small integration tests for critical endpoints (health, products list, attribute groups).

2) Improve developer ergonomics
   - Add a lightweight roadmap.md (this file).
   - Add small helper wrappers (withTimeout, withErrorHandling) around read-heavy endpoints — already present in lib/.
   - Ensure common utilities (slugify, isInStock, exportCsv) export both CommonJS and ESM-compatible defaults for predictable imports.

3) UX improvements for admin pages
   - Add copy/export affordances for sample products and CSV export links.
   - Make admin attribute editors resilient to missing data.

## Mid-term milestones 
- Add an "Import / Export" mini-workflow to seed/restore attribute groups (local or file upload).
- Add lightweight telemetry for admins (counts, last-updated timestamps).
- Implement role-aware actions and confirmation flows for destructive ops (delete group, remove attribute).

## Longer-term 
- Integrate optional external enrichment (AI assisted suggestions) behind feature flags and env variables.
- Add background jobs for large exports and async processing.
- Multi-tenant improvements, RBAC, and audit logs.

# NEXT STEPS

Priority follow-ups (ordered):

1. Audit lib/slugify.js and other utility modules to ensure both CommonJS and ESM import patterns work reliably (add default export where needed).
2. Add a small integration test for the public health and products endpoints (e.g., GET /api/health-check, GET /api/products).
3. Review API timeout settings and ensure long-running handlers respond with 504 and log context when timeouts trigger.
4. Improve documentation in README.md with quick start steps referencing the sample products and attribute groups.
5. Add tests and CI checks to guard against regressions when refactoring core libs (attribute parsing, product filtering).

If you'd like, I can:
- add a minimal test or CI config,
- add the slugify default-export shim,
- or add a small README section with quick start / API examples.

— Project maintainer
