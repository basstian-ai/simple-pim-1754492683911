# TEST PLAN

- Install deps:
  - npm ci
- Build:
  - npm run build
- Start (optional, to test runtime):
  - npm start
- Run tests (optional):
  - npm test
- Manual verification:
  - HTTP GET: curl -i http://localhost:3000/api/attributes
    - Expect 200 and JSON body (groups array) from data/attributes.json
  - Send OPTIONS: curl -i -X OPTIONS http://localhost:3000/api/attributes
    - Expect 204 and CORS headers
  - POST/PUT echo: curl -i -X POST -H "Content-Type: application/json" -d '{"foo":"bar"}' http://localhost:3000/api/attributes
    - Expect 202 JSON echo and serverSample
  - Confirm caching: after initial GET, update data/attributes.json mtime (e.g., touch the file), then GET again should reflect updated content (cache invalidates on mtime change).
- Remaining warnings:
  - Runtime log "Exceeded query duration limit..." is unrelated to build changes and reflects a long-running runtime query.
