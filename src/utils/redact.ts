export type RedactionRule = {
  name: string
  regex: RegExp
  replacement?: string
}

export type RedactOptions = {
  rules?: RedactionRule[]
  // max preview size in bytes (will slice input and append ellipsis if truncated)
  maxBytes?: number
}

const DEFAULT_MAX_BYTES = 8 * 1024 // 8KB

// sensible default redaction rules
export const DEFAULT_REDACTION_RULES: RedactionRule[] = [
  {
    name: 'email',
    // simple email detection
    regex: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    replacement: '[REDACTED-EMAIL]'
  },
  {
    name: 'ssn',
    // US SSN formats like 123-45-6789 or 123456789
    regex: /\b(\d{3}-\d{2}-\d{4}|\d{9})\b/g,
    replacement: '[REDACTED-SSN]'
  },
  {
    name: 'token',
    // common-looking tokens: long hex/base64-like strings; conservative: 20+ contiguous alphanum or -_~
    regex: /\b([A-Za-z0-9\-_=~]{20,})\b/g,
    replacement: '[REDACTED-TOKEN]'
  }
]

/**
 * Redacts a payload string according to rules and returns a safe preview.
 * - Applies redaction rules in order.
 * - Truncates to maxBytes (by UTF-8 byte approximation using encodeURIComponent) and appends "\n...truncated..." when truncated.
 */
export function redactPayload(input: string, opts?: RedactOptions): string {
  const rules = opts?.rules ?? DEFAULT_REDACTION_RULES
  const maxBytes = opts?.maxBytes ?? DEFAULT_MAX_BYTES

  // apply rules sequentially
  let out = input
  for (const r of rules) {
    out = out.replace(r.regex, r.replacement ?? '[REDACTED]')
  }

  // naive byte-length via encodeURIComponent
  const bytes = new TextEncoder().encode(out)
  if (bytes.length <= maxBytes) return out

  // find a safe cut point (truncate by characters while respecting bytes)
  let truncated = out
  let lo = 0
  let hi = out.length
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    const chunk = out.slice(0, mid)
    const chunkBytesLen = new TextEncoder().encode(chunk).length
    if (chunkBytesLen <= maxBytes) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  const safeCut = Math.max(0, lo - 1)
  truncated = out.slice(0, safeCut)
  return truncated + "\n...truncated..."
}
