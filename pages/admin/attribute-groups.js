import React from "react";

function useAttributeGroups() {
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchGroups = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/attribute-groups");
      if (!res.ok) throw new Error("Failed to load attribute groups");
      const data = await res.json();
      setGroups(data);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, refresh: fetchGroups };
}

export default function AttributeGroupsAdminPage() {
  const { groups, loading, error, refresh } = useAttributeGroups();
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!code.trim() || !name.trim()) {
      setFormError("Code and Name are required");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/attribute-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), name: name.trim(), attributes: [] })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data && data.error ? data.error : `Request failed (${res.status})`);
      }
      setCode("");
      setName("");
      await refresh();
    } catch (e) {
      setFormError(e.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: "#555", marginTop: 0 }}>Create simple attribute groups to organize your product attributes.</p>

      <section style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Add New Group</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
          <label style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, color: "#666" }}>Code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. specs"
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, minWidth: 180 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, color: "#666" }}>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Specifications"
              style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, minWidth: 220 }}
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "10px 12px", borderRadius: 4, border: "1px solid #333", background: "#111", color: "#fff", cursor: "pointer" }}
          >
            {submitting ? "Adding..." : "Add Group"}
          </button>
        </form>
        {formError ? <div style={{ color: "#b00", marginTop: 8 }}>{formError}</div> : null}
      </section>

      <section>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Existing Groups</h2>
        {loading && <div>Loading groups...</div>}
        {error && <div style={{ color: "#b00" }}>{error}</div>}
        {!loading && !error && groups.length === 0 && <div>No attribute groups yet.</div>}
        <div style={{ display: "grid", gap: 12 }}>
          {groups.map((g) => (
            <div key={g.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <strong>{g.name}</strong>
                <code style={{ color: "#666" }}>{g.code}</code>
              </div>
              <div style={{ marginTop: 6, fontSize: 14, color: "#555" }}>
                {g.attributes && g.attributes.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {g.attributes.map((a) => (
                      <li key={`${g.id}:${a.code}`}>
                        <span>{a.name}</span>
                        <span style={{ color: "#888" }}> ({a.code})</span>
                        <span style={{ color: "#aaa" }}> · {a.type}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <em style={{ color: "#777" }}>No attributes yet</em>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
