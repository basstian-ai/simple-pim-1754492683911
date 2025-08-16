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
```
