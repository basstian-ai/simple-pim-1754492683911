# Query timeout configuration

This small helper provides a single place to control the default DB/query timeout used across services.

- Env var: QUERY_TIMEOUT_MS (milliseconds)
- Default: 300000 (5 minutes)
- Min enforced: 10000 (10 seconds)
- Max enforced: 30 minutes

Why: Some long-running queries may legitimately require more time (during backfills, reports), but we still want a safe global cap and the ability to raise the limit temporarily without code changes.

Operational notes:
- To raise the timeout for a service, set QUERY_TIMEOUT_MS in the service env (e.g. deployment or container) to the desired ms value.
- Prefer addressing query performance (indexes, pagination) before increasing timeouts for production-facing endpoints.
