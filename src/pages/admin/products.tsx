import React, { useEffect, useState, useRef } from 'react'
import ProductFilters, { Filters } from '../../components/ProductFilters'
import { exportToCsv } from '../../utils/csv'

type Product = {
  id: string
  name: string
  sku: string
  tag?: string
  inStock: boolean
  price: number
}

const buildQuery = (filters: Filters) => {
  const q = new URLSearchParams()
  if (filters.search) q.set('search', filters.search)
  if (filters.tag) q.set('tag', filters.tag)
  if (filters.inStock) q.set('inStock', '1')
  return q.toString() ? `?${q.toString()}` : ''
}

export default function AdminProductsPage() {
  const [filters, setFilters] = useState<Filters>({ search: '', tag: '', inStock: false })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // When filters change, sync URL (history) and fetch
  useEffect(() => {
    const qs = buildQuery(filters)
    const url = `${window.location.pathname}${qs}`
    // Update URL without full reload
    window.history.replaceState({}, '', url)

    // Cancel previous
    if (abortRef.current) abortRef.current.abort()
    const ac = new AbortController()
    abortRef.current = ac

    setLoading(true)
    setError(null)

    fetch(`/api/admin/products${qs}`, { signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch: ${r.status}`)
        return r.json()
      })
      .then((data: Product[]) => {
        setProducts(data)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error(err)
        setError(err.message || 'Fetch error')
      })
      .finally(() => setLoading(false))

    return () => ac.abort()
  }, [filters])

  // On mount: read URL and seed filters from query strings
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const seeded: Filters = {
      search: params.get('search') || '',
      tag: params.get('tag') || '',
      inStock: params.get('inStock') === '1'
    }
    setFilters(seeded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tags = Array.from(new Set(products.map((p) => p.tag).filter(Boolean))) as string[]

  const handleExport = () => {
    if (!products.length) return
    // CSV rows: id,name,sku,tag,inStock,price
    const rows = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      tag: p.tag || '',
      inStock: p.inStock ? 'yes' : 'no',
      price: p.price.toString()
    }))
    exportToCsv('products.csv', rows)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin — Products</h1>
      <ProductFilters filters={filters} tags={tags} onChange={setFilters} />

      <div style={{ marginTop: 12 }}>
        <button onClick={handleExport} disabled={!products.length} data-testid="export-csv">
          Export CSV
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && <div data-testid="loading">Loading…</div>}
        {error && <div data-testid="error">{error}</div>}
        {!loading && !products.length && <div data-testid="empty">No products</div>}

        {products.length > 0 && (
          <table data-testid="products-table" border={1} cellPadding={6} style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Tag</th>
                <th>In stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.tag || '-'}</td>
                  <td>{p.inStock ? 'Yes' : 'No'}</td>
                  <td>{p.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
