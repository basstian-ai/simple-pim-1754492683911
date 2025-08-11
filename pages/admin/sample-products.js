import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function ProductCard({ product }) {
  const [copied, setCopied] = useState(false);
  const price = useMemo(() => {
    const dollars = (product.price / 100).toFixed(2);
    return `${product.currency} ${dollars}`;
  }, [product.price, product.currency]);

  async function copyJson() {
    try {
      const json = JSON.stringify(product, null, 2);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(json);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = json;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
      alert("Copy to clipboard failed");
    }
  }

  return (
    <div className="card">
      <div className="media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images?.[0]?.src || "/placeholder.png"} alt={product.images?.[0]?.alt || product.name} />
      </div>
      <div className="info">
        <div className="title">
          <strong>{product.name}</strong>
          <span className={`badge ${product.status}`}>{product.status}</span>
        </div>
        <div className="meta">
          <span>SKU: {product.sku}</span>
          <span>Price: {price}</span>
          <span>Variants: {product.variants?.length || 0}</span>
        </div>
        <p className="desc">{product.description}</p>
        <div className="groups">
          {product.attributeGroups?.slice(0, 2).map((g) => (
            <div className="group" key={g.name}>
              <div className="groupName">{g.name}</div>
              <ul>
                {g.attributes.slice(0, 3).map((a) => (
                  <li key={a.key}>
                    <span className="k">{a.label || a.key}:</span> {String(a.value)}{a.unit ? ` ${a.unit}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="actions">
          <button onClick={copyJson}>{copied ? "Copied" : "Copy JSON"}</button>
          <a className="secondary" href={`/api/products/sample?q=${encodeURIComponent(product.sku)}`} target="_blank" rel="noreferrer">API Preview</a>
        </div>
      </div>
      <style jsx>{`
        .card { display: flex; gap: 16px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
        .media { width: 140px; height: 140px; flex: 0 0 auto; overflow: hidden; border-radius: 8px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
        img { width: 100%; height: 100%; object-fit: cover; }
        .info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .title { display: flex; align-items: center; gap: 8px; font-size: 16px; }
        .badge { font-size: 11px; padding: 2px 6px; border-radius: 9999px; text-transform: uppercase; letter-spacing: .03em; }
        .badge.active { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .badge.draft { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .meta { display: flex; gap: 12px; color: #6b7280; font-size: 13px; }
        .desc { color: #374151; font-size: 14px; margin: 0; }
        .groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; }
        .group { background: #f9fafb; padding: 8px; border-radius: 6px; border: 1px solid #eef2f7; }
        .groupName { font-weight: 600; font-size: 12px; color: #374151; margin-bottom: 4px; }
        .k { color: #6b7280; }
        .actions { display: flex; gap: 8px; margin-top: 8px; }
        button { background: #111827; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
        .secondary { border: 1px solid #d1d5db; padding: 7px 12px; border-radius: 6px; color: #111827; text-decoration: none; }
      `}</style>
    </div>
  );
}

export default function SampleProductsAdmin() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const url = query ? `/api/products/sample?q=${encodeURIComponent(query)}` : "/api/products/sample";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setProducts(Array.isArray(data.products) ? data.products : []);
        setError(null);
      })
      .catch((e) => active && setError(e?.message || "Failed to load"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [query]);

  async function copyAll() {
    try {
      const json = JSON.stringify(products, null, 2);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(json);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = json;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      alert("All sample products copied to clipboard");
    } catch (e) {
      alert("Copy failed");
    }
  }

  return (
    <div className="wrap">
      <header className="hdr">
        <div>
          <h1>Sample Products</h1>
          <p className="sub">Browse and copy rich sample products to seed your catalog.</p>
        </div>
        <nav className="nav">
          <Link href="/">
            <a className="link">Dashboard</a>
          </Link>
        </nav>
      </header>

      <section className="toolbar">
        <input
          type="search"
          placeholder="Search by name, slug, or SKU"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search sample products"
        />
        <div className="spacer" />
        <button onClick={copyAll} disabled={!products.length}>Copy All</button>
      </section>

      {loading && <div className="state">Loading...</div>}
      {error && <div className="state err">{error}</div>}
      {!loading && !error && (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {!products.length && <div className="state">No sample products found.</div>}
        </div>
      )}

      <style jsx>{`
        .wrap { max-width: 1000px; margin: 0 auto; padding: 20px; }
        .hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        h1 { margin: 0; font-size: 22px; }
        .sub { margin: 4px 0 0; color: #6b7280; }
        .nav .link { color: #2563eb; text-decoration: none; }
        .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        input[type="search"] { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%; }
        .spacer { flex: 1; }
        .grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .state { padding: 16px; color: #6b7280; }
        .state.err { color: #b91c1c; }
        @media (min-width: 860px) { .grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
