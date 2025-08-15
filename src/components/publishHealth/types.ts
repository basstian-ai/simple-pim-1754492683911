export type RetryMetric = {
  channel: string;
  // total number of retry attempts observed in the time window
  totalRetries: number;
  // number of jobs that succeeded after at least one retry
  successAfterRetry: number;
  // maximum number of attempts observed for a single job
  maxAttempts: number;
  // optional sample job ids for drill-down links
  sampleJobIds?: string[];
};
