import React from "react";

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 4 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
      />
    </label>
  );
}

function NumberInput({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 4 }}>{label}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value || 0, 10))}
        placeholder={placeholder}
        style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 6 }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 4 }}>{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, fontFamily: "monospace" }}
      />
    </label>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [msg, setMsg] = React.useState("");

  const [name, setName] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [currency, setCurrency] = React.useState("USD");
  const [description, setDescription] = React.useState("");
  const [attributesJson, setAttributesJson] = React.useState("[]");
  const [variantsJson, setVariantsJson] = React.useState("[]");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSku("");
    setPrice(0);
    setCurrency("USD");
    setDescription("");
    setAttributesJson(
      JSON.stringify(
        [
          { group: "General", items: [{ name: "Brand", value: "SimplePIM" }] },
          { group: "Specs", items: [{ name: "Color", value: "Black" }] }
        ],
        null,
        2
      )
    );
    setVariantsJson(
      JSON.stringify(
        [
          { sku: "SKU-VAR-1", attributes: [{ name: "Size", value: "M" }], priceDelta: 0, stock: 10 }
        ],
        null,
        2
      )
    );
  };

  React.useEffect(() => {
    resetForm();
  }, []);

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      if (json.ok) setProducts(json.data);
      else setMsg(json.error?.message || "Failed to load");
    } catch (e) {
      setMsg("Network error while loading products");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      let attributes = [];
      let variants = [];
      try {
        attributes = JSON.parse(attributesJson || "[]");
      } catch (e) {
        setMsg("Attributes JSON is invalid");
        setSaving(false);
        return;
      }
      try {
        variants = JSON.parse(variantsJson || "[]");
      } catch (e) {
        setMsg("Variants JSON is invalid");
        setSaving(false);
        return;
      }

      const payload = {
        name,
        sku,
        price: parseInt(price || 0, 10),
        currency,
        description,
        attributes,
        variants
      };

      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...payload } : payload;

      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Save failed");
      setMsg(editingId ? "Updated" : "Created");
      resetForm();
      await load();
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    setName(p.name || "");
    setSku(p.sku || "");
    setPrice(p.price || 0);
    setCurrency(p.currency || "USD");
    setDescription(p.description || "");
    setAttributesJson(JSON.stringify(p.attributes || [], null, 2));
    setVariantsJson(JSON.stringify(p.variants || [], null, 2));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setMsg("");
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || "Delete failed");
      setMsg("Deleted");
      await load();
    } catch (e) {
      setMsg(e.message || "Delete failed");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Admin • Products</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Manage rich product data with attribute groups and basic variants.</p>

      {msg ? (
        <div style={{ background: "#eef9f1", border: "1px solid #b7ebc6", padding: 8, marginBottom: 16, color: "#156f3a" }}>{msg}</div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32, alignItems: "start" }}>
        <div>
          <TextInput label="Name" value={name} onChange={setName} placeholder="Product name" />
          <TextInput label="SKU" value={sku} onChange={setSku} placeholder="SKU" />
          <NumberInput label="Price (minor units, e.g. cents)" value={price} onChange={setPrice} placeholder="1999" />
          <TextInput label="Currency" value={currency} onChange={setCurrency} placeholder="USD" />
          <TextArea label="Description" value={description} onChange={setDescription} rows={4} />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={saving} style={{ padding: "10px 14px", background: "#111", color: "white", border: 0, borderRadius: 4 }}>
              {saving ? "Saving…" : editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} style={{ padding: "10px 14px", background: "#eee", color: "#333", border: 0, borderRadius: 4 }}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </div>
        <div>
          <TextArea label="Attribute Groups (JSON)" value={attributesJson} onChange={setAttributesJson} rows={10} />
          <TextArea label="Variants (JSON)" value={variantsJson} onChange={setVariantsJson} rows={10} />
        </div>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Products</h2>
        <button onClick={load} disabled={loading} style={{ padding: "6px 10px", border: "1px solid #ccc", background: "white", borderRadius: 4 }}>{loading ? "Loading…" : "Refresh"}</button>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 6 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Name</th>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>SKU</th>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Price</th>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Variants</th>
              <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Attributes</th>
              <th style={{ textAlign: "right", padding: 10, borderBottom: "1px solid #eee" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{p.slug}</div>
                </td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{p.sku}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>
                  {new Intl.NumberFormat(undefined, { style: "currency", currency: p.currency || "USD" }).format((p.price || 0) / 100)}
                </td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1", maxWidth: 240 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(p.variants || []).slice(0, 4).map((v) => (
                      <span key={v.id || v.sku} style={{ fontSize: 12, padding: "2px 6px", border: "1px solid #ddd", borderRadius: 4 }}>
                        {v.attributes?.map((a) => `${a.name}:${a.value}`).join("/") || v.sku}
                      </span>
                    ))}
                    {p.variants && p.variants.length > 4 ? <span style={{ fontSize: 12, color: "#666" }}>+{p.variants.length - 4} more</span> : null}
                  </div>
                </td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1", maxWidth: 240 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(p.attributes || []).map((g) => (
                      <span key={g.group} style={{ fontSize: 12, padding: "2px 6px", background: "#f7f7f7", border: "1px solid #eee", borderRadius: 4 }}>
                        {g.group}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1", textAlign: "right" }}>
                  <button onClick={() => onEdit(p)} style={{ padding: "6px 10px", marginRight: 8, border: "1px solid #ccc", background: "white", borderRadius: 4 }}>Edit</button>
                  <button onClick={() => onDelete(p.id)} style={{ padding: "6px 10px", border: 0, background: "#e5484d", color: "white", borderRadius: 4 }}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#666" }}>No products yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
