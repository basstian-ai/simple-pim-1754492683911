# Bugs
(Observable defects with repro & expected vs actual.)

```yaml
queue:
  - id: BUG-dpl_HK-1755266967960
    title: App runtime errors & warnings from latest deployment
    details: >-
      ### Query duration exceeded (5-minute limit)


      Long-running query was terminated after surpassing the 5-minute execution cap. Likely causes include inefficient
      query plans, missing indexes, or large/full-table scans.  

      Recommended actions: review the query/explain plan, add appropriate indexes or filters, paginate or batch the
      workload, or adjust the timeout if longer runs are expected.
    created: '2025-08-15T14:09:27.960Z'
  - id: BUG-dpl_8G-1755344862515
    title: App runtime errors & warnings from latest deployment
    details: |-
      - **Query exceeded 5-minute execution limit**
        
        Long-running query(s) are being terminated after surpassing the 5-minute execution cap, causing failures and incomplete results.  
        Investigate queries that exceed the limit (explain/trace plans, missing indexes, inefficient joins), add pagination or batching, or adjust the timeout policy if appropriate.
    created: '2025-08-16T11:47:42.515Z'
  - id: BUG-dpl_8G-1755382640949
    title: App runtime errors & warnings from latest deployment
    details: >-
      ### Query timed out after 5 minutes

      Long-running query exceeded the configured 5-minute execution limit and was terminated.  

      This causes user requests or background jobs to fail or return incomplete results for large or unoptimized
      queries.  

      Investigate and profile the query, add indexes/pagination or optimize the logic; consider adjusting timeout policy
      only if safe.
    created: '2025-08-16T22:17:20.949Z'
  - id: BUG-dpl_8G-1755384666884
    title: App runtime errors & warnings from latest deployment
    details: >-
      ### Query duration limit exceeded

      Long-running queries are terminated after hitting the 5-minute execution cap, resulting in failed or incomplete
      responses. Likely causes include inefficient queries, missing indexes, or large unbounded scans. Fixes: optimize
      the query (add indexes, reduce scanned data, paginate), or adjust the timeout/config if appropriate and safe.
    created: '2025-08-16T22:51:06.884Z'
```
