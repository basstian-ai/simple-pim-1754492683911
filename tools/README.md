API route validator

Quick usage:

- Run locally: node tools/validate-api-routes.js
- In CI: run the same command as part of linting steps. The script exits non-zero when violations are present.

What it checks:

- Looks for common API folders (pages/api, src/pages/api, app/api, src/app/api, server/routes, src/server/routes).
- Validates that route file names (and parent dir for index files) are kebab-case: lower-case letters, numbers and hyphens only.

Why:

- Keeps route layout and naming consistent across the repository and avoids cross-platform filename surprises.

If you need to relax or extend rules, edit tools/validate-api-routes.js and update the tests accordingly.
