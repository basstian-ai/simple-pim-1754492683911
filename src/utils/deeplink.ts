export function encodeFeedFilters(filters: unknown): string {
  try {
    return encodeURIComponent(JSON.stringify(filters ?? {}));
  } catch (err) {
    // Fallback to empty filters if we can't serialize
    return encodeURIComponent(JSON.stringify({}));
  }
}

export function buildJobDetailPath(opts: {
  jobId: string;
  runId?: string | number;
  errorId?: string | number;
  feedFilters?: unknown;
}): string {
  const { jobId, runId, errorId, feedFilters } = opts;
  const base = runId ? `/jobs/${encodeURIComponent(String(jobId))}/runs/${encodeURIComponent(String(runId))}` : `/jobs/${encodeURIComponent(String(jobId))}`;
  const params = new URLSearchParams();
  if (errorId != null) params.set('errorId', String(errorId));
  if (feedFilters != null) {
    params.set('back', `/feed?filters=${encodeFeedFilters(feedFilters)}`);
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
