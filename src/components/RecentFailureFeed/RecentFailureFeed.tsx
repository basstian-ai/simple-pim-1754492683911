import React, {useEffect, useState} from 'react'
import {fetchRecentFailedJobs, JobFailure} from '../../api/publishJobs'

function taxonomyFor(errorCode?: string) {
  if (!errorCode) return 'unknown'
  const code = errorCode.toLowerCase()
  if (code.startsWith('val') || code.includes('validation')) return 'validation'
  if (code.startsWith('net') || code.includes('timeout') || code.includes('connect')) return 'network'
  if (code.includes('transform') || code.includes('mapping')) return 'transform'
  if (code.includes('auth') || code.includes('permission')) return 'auth'
  if (code.includes('rate')) return 'rate-limit'
  return 'unknown'
}

function taxonomyLabel(t: string) {
  switch (t) {
    case 'validation':
      return 'Validation'
    case 'network':
      return 'Network'
    case 'transform':
      return 'Transform'
    case 'auth':
      return 'Auth'
    case 'rate-limit':
      return 'Rate Limit'
    default:
      return 'Unknown'
  }
}

function timeAgo(iso: string) {
  try {
    const then = new Date(iso)
    const diff = Date.now() - then.getTime()
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  } catch (e) {
    return iso
  }
}

export const RecentFailureFeed: React.FC<{limit?: number}> = ({limit = 50}) => {
  const [items, setItems] = useState<JobFailure[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchRecentFailedJobs(limit)
      .then(data => {
        if (!mounted) return
        setItems(data.slice(0, limit))
      })
      .catch(err => {
        if (!mounted) return
        setError(err?.message || 'Unknown error')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [limit])

  return (
    <section aria-labelledby="recent-failures-heading" style={{border: '1px solid #e2e8f0', borderRadius: 6, padding: 12}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 id="recent-failures-heading" style={{margin: 0}}>Recent Failures (Publish Health)</h3>
        <small style={{color: '#6b7280'}}>showing up to {limit}</small>
      </div>

      {loading && <div role="status" aria-live="polite" style={{marginTop: 12}}>Loading recent failures…</div>}
      {error && <div role="alert" style={{marginTop: 12, color: '#b91c1c'}}>Error loading failures: {error}</div>}

      {!loading && !error && items && items.length === 0 && (
        <div style={{marginTop: 12, color: '#6b7280'}}>No recent failures.</div>
      )}

      {!loading && !error && items && items.length > 0 && (
        <ul style={{listStyle: 'none', padding: 0, marginTop: 12, maxHeight: 420, overflow: 'auto'}}>
          {items.map(it => {
            const tax = taxonomyFor(it.errorCode)
            const label = taxonomyLabel(tax)
            return (
              <li key={it.id} style={{padding: '8px 12px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 12, alignItems: 'center'}}>
                <div style={{flex: '0 0 10ch', fontSize: 12, color: '#374151'}}>{it.jobType}</div>
                <div style={{flex: '1 1 auto'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
                    <div style={{fontWeight: 600, color: '#111827'}}>{it.errorMessage ? it.errorMessage : (it.errorCode ?? 'Unknown failure')}</div>
                    <div style={{textAlign: 'right', minWidth: 90}}>
                      <div style={{fontSize: 12, color: '#6b7280'}}>{timeAgo(it.timestamp)} • {new Date(it.timestamp).toLocaleString()}</div>
                      <div style={{marginTop: 6}}>
                        <span style={{background: '#eef2ff', color: '#3730a3', padding: '2px 6px', borderRadius: 4, fontSize: 12}}>{label}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop: 6, display: 'flex', gap: 8}}>
                    <a href={`/jobs/${encodeURIComponent(it.id)}`} aria-label={`View job ${it.id}`}>
                      View details
                    </a>
                    {it.logUrl && (
                      <a href={it.logUrl} target="_blank" rel="noreferrer noopener">Logs</a>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default RecentFailureFeed
