```yaml
queue:
  - id: BUG-dpl_9S-1755195879709
    title: App runtime errors & warnings from latest deployment
    details: >-
      ## Bug: Query Duration Limit Exceeded

      The system throws an error when a query exceeds the maximum allowed duration of 5 minutes, potentially impacting
      user experience and data retrieval efficiency.
    created: '2025-08-14T18:24:39.709Z'
  - id: BUG-dpl_2m-1755220296616
    title: App runtime errors & warnings from latest deployment
    details: >-
      ## Bug: Query Duration Limit Exceeded

      The system is throwing an error when a query exceeds the maximum allowed execution time of 5 minutes. This
      requirement needs to be clearly documented, and the behavior should be handled gracefully or optimized to prevent
      timeout.
    created: '2025-08-15T01:11:36.616Z'
  - id: BUG-dpl_3C-1755239154930
    title: App runtime errors & warnings from latest deployment
    details: >-
      # Bug Report: Query Duration Limit Exceeded  

      **Description:** The system is generating an error when a query exceeds the allowed duration limit of 5 minutes,
      resulting in failed database operations.
    created: '2025-08-15T06:25:54.930Z'
  - id: BUG-dpl_HK-1755261088528
    title: App runtime errors & warnings from latest deployment
    details: >-
      ### Exceeded query duration limit (5 minutes)


      Query executions that run longer than 5 minutes are being terminated, producing errors and incomplete results.
      Reproducible with long-running/complex queries on large datasets.  

      Expected: queries either complete, timeouts are configurable, or long jobs are handled asynchronously; mitigate by
      query optimization, batching/pagination, or exposing a configurable timeout/queueing mechanism.
    created: '2025-08-15T12:31:28.528Z'
```
