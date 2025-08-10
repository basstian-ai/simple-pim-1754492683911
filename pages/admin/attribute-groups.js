import { useEffect, useMemo, useState } from 'react'

export default function AdminAttributeGroupsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groups, setGroups] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/attribute-groups')
        if (!res.ok) throw new Error('Failed to fetch attribute groups')
        const data = await res.json()
        if (active) setGroups(Array.isArray(data.attributeGroups) ? data.attributeGroups : [])
      } catch (e) {
        if (active) setError(e.message || 'Error loading attribute groups')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return groups
    return groups.filter((g) => {
      if (g.name?.toLowerCase().includes(q)) return true
      if (Array.isArray(g.attributes)) {
        return g.attributes.some((a) =>
          [a.code, a.label, a.type].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
        )
      }
      return false
    })
  }, [groups, query])

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>Attribute Groups</h1>
      <p style={{ color: '#555', marginTop: '8px' }}>Browse and search product attribute groups configured in the PIM.</p>

      <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search groups and attributes..."
          aria-label="Search attribute groups"
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            minWidth: '280px',
            outline: 'none'
          }}
        />
        <span style={{ color: '#888', fontSize: '12px' }}>
          {filtered.length} group{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {loading && <div style={{ color: '#666' }}>Loading attribute groups...</div>}
      {error && !loading && (
        <div style={{ color: '#b00020', background: '#fde7ea', border: '1px solid #f8c7cf', padding: '8px 12px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ color: '#666' }}>No attribute groups match your search.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginTop: '8px' }}>
        {filtered.map((g) => (
          <div key={g.id || g.name} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ fontSize: '16px', margin: 0 }}>{g.name}</h2>
              {g.id && (
                <code style={{ color: '#666', fontSize: '12px' }}>{g.id}</code>
              )}
            </div>
            <div style={{ marginTop: '8px' }}>
              {Array.isArray(g.attributes) && g.attributes.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {g.attributes.map((a) => (
                    <li key={a.code} style={{ padding: '6px 0', borderBottom: '1px dashed #f0f0f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <strong>{a.label || a.code}</strong>
                          <div style={{ color: '#777', fontSize: '12px' }}>{a.code}</div>
                        </div>
                        <div style={{ textAlign: 'right', color: '#555' }}>
                          <span style={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '12px',
                            background: '#fafafa'
                          }}>{a.type || 'text'}</span>
                          {a.required ? (
                            <span style={{ marginLeft: '6px', color: '#0b8457', fontSize: '12px' }}>required</span>
                          ) : (
                            <span style={{ marginLeft: '6px', color: '#999', fontSize: '12px' }}>optional</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#777', fontSize: '12px' }}>No attributes in this group.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
