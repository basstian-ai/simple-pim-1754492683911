import React, { useState } from 'react';

const QuickAdd = () => {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const q = name.trim();
    if (!q) {
      setError('Please enter a product name.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/quick-add-suggest?name=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch (_) {}
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: 8 }}>Quick Add: Name, Slug & SKU</h1>
      <p style={{ color: '#555', marginTop: 0 }}>Generate a clean slug and a stable SKU suggestion from a product name.</p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Enter product name (e.g. Red Mug 12oz)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Product name"
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 0.75rem' }}>
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </form>

      {error && (
        <div role="alert" style={{ background: '#fee', border: '1px solid #fbb', padding: 12, borderRadius: 6, color: '#900' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 8, alignItems: 'center' }}>
            <div style={{ color: '#666' }}>Name</div>
            <div>{result.name}</div>
            <button type="button" onClick={() => copy(result.name)}>Copy</button>

            <div style={{ color: '#666' }}>Slug</div>
            <div><code>{result.slug}</code></div>
            <button type="button" onClick={() => copy(result.slug)}>Copy</button>

            <div style={{ color: '#666' }}>SKU</div>
            <div><code>{result.sku}</code></div>
            <button type="button" onClick={() => copy(result.sku)}>Copy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAdd;
