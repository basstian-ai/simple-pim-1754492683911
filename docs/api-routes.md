# API Route Conventions

This document defines the project's API route layout, naming, and minimal request/response schema conventions. The goal is to have predictable file locations, consistent filenames, and a lightweight guideline for documenting route-level contracts.

Guiding principles

- Keep route locations predictable so humans and tools can find endpoints quickly.
- Use kebab-case for filenames to avoid OS/case issues and to be visually consistent.
- Prefer small, single-responsibility route files (one handler per file).
- Add a short route-level docblock (YAML-in-markdown fenced block) with input/output schema hints.

Where to put routes

- pages/api/ (Next.js "pages" based routes): use for edge/SSR-compatible endpoints when the project uses the pages router.
- app/api/ or src/app/api/ (Next.js App Router route handlers): use for route handlers under the App Router pattern.
- server/routes/ or src/server/routes/ (custom server or backend-only routes): use for server-only express/fastify/k8s-backend handlers.

Naming conventions

- Filenames should be kebab-case and only contain a-z, 0-9 and hyphens. Example: fetch-product.ts, update-variant.ts
- Avoid spaces, underscores, camelCase, or uppercase characters in filenames.
- File extensions accepted: .ts, .js, .tsx, .jsx

Exports & handlers

- For Next "pages" API routes, export default a handler function: export default function handler(req, res) { ... }
- For App Router route files, export named methods (GET, POST, etc.) per Next's conventions.
- For server framework files (express/fastify), export a function or router that the app mounts.

Route-level documentation (recommended)

Include a small fenced YAML block at the top of route files (markdown-style) describing the HTTP method(s), expected request shape and response shape. This is vendor-neutral and can be parsed by tooling.

Example (YAML-in-markdown at top of route file):

```yaml
---
route: /api/products/fetch
methods: [GET]
summary: Fetch product by id
request:
  params:
    - name: id
      in: query
      required: true
      schema:
        type: string
response:
  200:
    description: Product object
    content-type: application/json
    schema:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
---
```

This block is intentionally lightweight (not full OpenAPI). The aim is quick developer discoverability and machine-parsable hints.

Validation script

We provide a small validation utility (tools/validate-api-routes.js) that scans the repo for common API route folders and enforces filename kebab-case. Run it in CI or locally (see tools/README snippet below).

CI recommendation

- Add the validator to CI as a fast gating step so route naming violations are caught early.

Notes

- These are conventions and are safe to relax per-team. The validator errs on the side of being helpful rather than blocking—it's intended to be run during CI and adjusted if needed.
