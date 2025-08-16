/*
 * Query timeout configuration helper
 * - Reads QUERY_TIMEOUT_MS from environment
 * - Provides safe defaults and bounds to avoid accidental extreme values
 *
 * Usage: import { getQueryTimeoutMs } and use the returned ms value when
 * configuring DB/query runners or per-request cancellation timers.
 */

export const DEFAULT_QUERY_TIMEOUT_MS = 300_000; // 5 minutes
export const MIN_QUERY_TIMEOUT_MS = 10_000; // 10 seconds
export const MAX_QUERY_TIMEOUT_MS = 30 * 60_000; // 30 minutes (cap)

export function getQueryTimeoutMs(): number {
  const raw = process.env.QUERY_TIMEOUT_MS;
  if (!raw) return DEFAULT_QUERY_TIMEOUT_MS;

  // allow numeric strings only
  const n = Number(raw);
  if (!Number.isFinite(n) || Number.isNaN(n) || n <= 0) {
    return DEFAULT_QUERY_TIMEOUT_MS;
  }

  // enforce integer ms and safe bounds
  const rounded = Math.floor(n);
  if (rounded < MIN_QUERY_TIMEOUT_MS) return MIN_QUERY_TIMEOUT_MS;
  if (rounded > MAX_QUERY_TIMEOUT_MS) return MAX_QUERY_TIMEOUT_MS;
  return rounded;
}
