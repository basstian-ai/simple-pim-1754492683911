import React from 'react';

// Accessible admin products list. Small, self-contained component used for an accessibility
// regression test. Key accessibility considerations applied:
// - Table has a <caption> describing purpose
// - Column headers are real <th> with scope and aria-sort when sorting applies
// - Action buttons provide explicit aria-labels
// - Search input is labelled with a visible label and associated with the input via htmlFor
// - Keyboard-focusable elements are native controls (button, input)

export default function AdminProducts({ products = [] }) {
  // Simple client-side sort indicator (not interactive) to demonstrate aria-sort usage
  const sortedBy = 'name';

  return (
    <main aria-labelledby="admin-products-heading">
      <h1 id="admin-products-heading">Products (Admin)</h1>

      <section aria-labelledby="search-heading" aria-describedby="search-desc">
        <h2 id="search-heading" style={{ fontSize: '1rem' }}>Search</h2>
        <p id="search-desc" style={{ marginTop: 0, marginBottom: '0.5rem', color: '#555' }}>
          Filter products by name or SKU. Use keyboard Tab to reach the input and press Enter to submit.
        </p>
        <label htmlFor="product-search">Product name or SKU</label>
        <div style={{ marginTop: '0.25rem' }}>
          <input id="product-search" name="q" type="search" aria-label="Search products" placeholder="Search products" />
          <button type="button" aria-label="Search products button" style={{ marginLeft: '0.5rem' }}>Search</button>
        </div>
      </section>

      <section aria-labelledby="list-heading" style={{ marginTop: '1rem' }}>
        <h2 id="list-heading">Product list</h2>

        <table role="table" aria-describedby="table-desc" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <caption id="table-desc">List of products. Use the actions column to edit or delete a product.</caption>
          <thead>
            <tr>
              <th scope="col">SKU</th>
              <th scope="col" aria-sort={sortedBy === 'name' ? 'ascending' : 'none'}>Name</th>
              <th scope="col">In stock</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="4">No products found.</td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.sku}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td aria-label={p.inStock ? 'In stock' : 'Out of stock'}>{p.inStock ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" aria-label={`Edit product ${p.name}`}>Edit</button>
                  <button type="button" aria-label={`Delete product ${p.name}`} style={{ marginLeft: '0.5rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
