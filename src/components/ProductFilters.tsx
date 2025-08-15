import React, { useEffect, useState } from 'react'

export type Filters = {
  search: string
  tag: string
  inStock: boolean
}

type Props = {
  filters: Filters
  tags?: string[]
  onChange: (f: Filters) => void
}

export default function ProductFilters({ filters, tags = [], onChange }: Props) {
  const [search, setSearch] = useState(filters.search)
  const [tag, setTag] = useState(filters.tag)
  const [inStock, setInStock] = useState(filters.inStock)

  // keep local state in sync when parent seed changes (e.g., initial URL)
  useEffect(() => {
    setSearch(filters.search)
    setTag(filters.tag)
    setInStock(filters.inStock)
  }, [filters.search, filters.tag, filters.inStock])

  const emit = (next: Partial<Filters>) => {
    const merged: Filters = { search, tag, inStock, ...next }

    // update history query params (URL-query syncing)
    const p = new URLSearchParams()
    if (merged.search) p.set('search', merged.search)
    if (merged.tag) p.set('tag', merged.tag)
    if (merged.inStock) p.set('inStock', '1')
    const qs = p.toString() ? `?${p.toString()}` : ''
    window.history.replaceState({}, '', `${window.location.pathname}${qs}`)

    onChange(merged)
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label>
        Search:{' '}
        <input
          data-testid="filter-search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          onBlur={() => emit({ search })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') emit({ search })
          }}
        />
      </label>

      <label>
        Tag:{' '}
        <select
          data-testid="filter-tag"
          value={tag}
          onChange={(e) => {
            setTag(e.target.value)
            emit({ tag: e.target.value })
          }}
        >
          <option value="">— all —</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label>
        <input
          data-testid="filter-instock"
          type="checkbox"
          checked={inStock}
          onChange={(e) => {
            setInStock(e.target.checked)
            emit({ inStock: e.target.checked })
          }}
        />{' '}
        In stock
      </label>
    </div>
  )
}
