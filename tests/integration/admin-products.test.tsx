import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminProductsPage from '../../src/pages/admin/products'

// A small integration-style test that stubs fetch and asserts filter + CSV behavior

describe('AdminProductsPage', () => {
  const SAMPLE = [
    { id: 'p1', name: 'Classic Tee', sku: 'CT-001', tag: 'clothing', inStock: true, price: 19.99 },
    { id: 'p2', name: 'Sneakers', sku: 'SN-123', tag: 'shoes', inStock: false, price: 59.99 },
  ]

  beforeEach(() => {
    // stub window.fetch
    jest.spyOn(window, 'fetch').mockImplementation((input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.url
      const u = new URL(url, 'http://localhost')
      const search = u.searchParams.get('search') || ''
      const tag = u.searchParams.get('tag') || ''
      const inStock = u.searchParams.get('inStock')
      let out = SAMPLE.slice()
      if (search) out = out.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      if (tag) out = out.filter((p) => p.tag === tag)
      if (inStock === '1') out = out.filter((p) => p.inStock)
      return Promise.resolve(new Response(JSON.stringify(out), { status: 200 }))
    })
  })

  afterEach(() => {
    ;(window.fetch as jest.Mock).mockRestore()
    jest.restoreAllMocks()
  })

  test('filters by search and in-stock and exports CSV', async () => {
    // spy on URL.createObjectURL so we know export tried to create blob
    const createObjectURL = jest.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:fake')

    render(<AdminProductsPage />)

    // Wait for initial render + fetch
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument())

    // Initially both products shown
    expect(screen.getByText('Classic Tee')).toBeInTheDocument()
    expect(screen.getByText('Sneakers')).toBeInTheDocument()

    // Type search that matches only Classic Tee
    const search = screen.getByTestId('filter-search') as HTMLInputElement
    fireEvent.change(search, { target: { value: 'classic' } })
    fireEvent.keyDown(search, { key: 'Enter' })

    // Wait for reload
    await waitFor(() => expect(screen.queryByText('Sneakers')).not.toBeInTheDocument())
    expect(screen.getByText('Classic Tee')).toBeInTheDocument()

    // Toggle in-stock off/on to ensure it still works (Classic Tee is in stock)
    const instock = screen.getByTestId('filter-instock') as HTMLInputElement
    expect(instock.checked).toBe(false)
    fireEvent.click(instock)

    await waitFor(() => expect(screen.getByText('Classic Tee')).toBeInTheDocument())

    // Click export and ensure createObjectURL called
    const btn = screen.getByTestId('export-csv') as HTMLButtonElement
    fireEvent.click(btn)
    expect(createObjectURL).toHaveBeenCalled()

    createObjectURL.mockRestore()
  })
})
