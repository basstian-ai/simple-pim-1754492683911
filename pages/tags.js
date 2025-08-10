import React, { useEffect, useState } from 'react';

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch('/api/tags');
        const data = await res.json();
        if (!cancelled) setTags(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setTags([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Browse Tags</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Click a tag to view filtered products.</p>
      {loading && <div>Loading tags…</div>}
      {!loading && tags.length === 0 && <div>No tags found.</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {tags.map((tag) => (
          <a
            key={tag}
            href={`/?tags=${encodeURIComponent(tag)}`}
            style={{
              padding: '0.4rem 0.7rem',
              borderRadius: 999,
              border: '1px solid #ddd',
              background: '#fafafa',
              color: '#333',
              textDecoration: 'none',
              fontSize: 13,
            }}
            aria-label={`Filter products by tag ${tag}`}
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TagsPage;
