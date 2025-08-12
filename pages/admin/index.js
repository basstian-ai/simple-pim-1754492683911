import React from "react";

function Stat({ label, value }) {
  return (
    <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
      <div style={{ color: "#6b7280", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function VariantsTable({ variants }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>SKU</th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Options</th>
          <th style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Price</th>
          <th style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", padding: "8px 4px" }}>Stock</th>
        </tr>
      </thead>
      <tbody>
        {variants.map((v) => (
          <tr key={v.id}>
            <td style={{ padding: "8px 4px", borderBottom: "1px solid #f3f4f6" }}>{v.sku}</td>
            <td style={{ padding: "8px 4px", borderBottom: "1px solid #f3f4f6" }}>
              {Object.entries(v.options).map(([k, val]) => (
                <span key={k} style={{ display: "inline-block", marginRight: 8, padding: "2px 6px", background: "#f3f4f6", borderRadius: 4, fontSize: 12 }}>
                  {k}: {val}
                </span>
              ))}
            </td>
            <td style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #f3f4f6" }}>
              ${(v.price / 100).toFixed(2)}
            </td>
            <td style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #f3f4f6" }}>{v.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState({ products: [], attributes: [] });

  React.useEffect(() => {
    // Add a client-side timeout and abort to avoid long-hanging requests
    let isMounted = true;
    const controller = new AbortController();
    const timeoutMs = 30_000; // 30s
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    async function load() {
      try {
        const res = await fetch("/api/admin/products", { signal: controller.signal });
        if (!res.ok) {
          // If request was aborted, fetch may throw; this ensures we surface a helpful message.
          throw new Error(`Failed to load products (${res.status})`);
        }
        const json = await res.json();
        if (isMounted) {
          setData({ products: json.products || [], attributes: json.attributes || [] });
        }
      } catch (e) {
        if (!isMounted) return;
        if (e && e.name === "AbortError") {
          setError("Request timed out after 30s");
        } else {
          setError(e.message || String(e));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
      clearTimeout(timer);
      try {
        controller.abort();
      } catch (_) {}
    };
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>PIM Admin</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>View products, attribute groups, and basic variants.</p>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "#b91c1c" }}>Error: {error}</div>}

      {!loading && !error && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 24 }}>
            <Stat label="Products" value={data.products.length} />
            <Stat label="Attribute Groups" value={data.attributes.length} />
            <Stat label="Total Variants" value={data.products.reduce((acc, p) => acc + (p.variants ? p.variants.length : 0), 0)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Attribute Groups</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
              {data.attributes.map((group) => (
                <div key={group.code} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fff" }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{group.name}</div>
                  <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>Code: {group.code}</div>
                  <div>
                    {group.attributes.map((attr) => (
                      <div key={attr.code} style={{ marginBottom: 6 }}>
                        <div style={{ fontWeight: 500 }}>{attr.name} <span style={{ color: "#6b7280" }}>({attr.code})</span></div>
                        {attr.options && attr.options.length > 0 && (
                          <div style={{ marginTop: 4 }}>
                            {attr.options.map((opt) => (
                              <span key={opt.code} style={{ display: "inline-block", marginRight: 6, marginBottom: 4, padding: "2px 6px", background: "#f3f4f6", borderRadius: 4, fontSize: 12 }}>
                                {opt.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(1, minmax(0,1fr))", gap: 12 }}>
              {data.products.map((product) => (
                <div key={product.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{product.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 12 }}>ID: {product.id} · Slug: {product.slug}</div>
                    </div>
                    <div style={{ color: "#111827", fontWeight: 700 }}>${(product.price / 100).toFixed(2)}</div>
                  </div>
                  <p style={{ color: "#374151", marginBottom: 12 }}>{product.description}</p>
                  {product.attributes && (
                    <div style={{ marginBottom: 12 }}>
                      {Object.entries(product.attributes).map(([k, v]) => (
                        <span key={k} style={{ display: "inline-block", marginRight: 8, padding: "2px 6px", background: "#eef2ff", borderRadius: 4, fontSize: 12 }}>
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                  {product.variants && product.variants.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Variants ({product.variants.length})</div>
                      <VariantsTable variants={product.variants} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
