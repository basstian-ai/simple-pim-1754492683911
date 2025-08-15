export type JobFailure = {
  id: string
  jobType: string
  status: 'failed' | 'error' | 'fatal'
  errorCode?: string
  errorMessage?: string
  timestamp: string // ISO
  logUrl?: string
}

// Minimal API client to fetch recent failed publish jobs.
// The real app should wire this to actual backend endpoints and auth.
export async function fetchRecentFailedJobs(limit = 50): Promise<JobFailure[]> {
  const url = `/api/publish/jobs?failed=true&limit=${encodeURIComponent(String(limit))}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch recent failed jobs: ${res.status} ${text}`)
  }

  const body = await res.json()
  // Expecting an array of JobFailure-like objects from the server.
  return Array.isArray(body) ? body : []
}
