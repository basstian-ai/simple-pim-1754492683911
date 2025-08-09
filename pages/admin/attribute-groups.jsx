import React, { useEffect, useState } from "react";
const ag = require("../../lib/attributeGroups");

function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "block", marginBottom: 8 }}>
      <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{label}</div>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "8px 10px",
          border: "1px solid #ccc",
          borderRadius: 6,
          outline: "none"
        }}
      />
    </label>
  );
}

export default function AttributeGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newAttr, setNewAttr] = useState({}); // { [groupId]: value }

  useEffect(() => {
    setGroups(ag.loadGroups());
  }, []);

  useEffect(() => {
    ag.saveGroups(groups);
  }, [groups]);

  function onAddGroup(e) {
    e && e.preventDefault();
    if (!newGroupName.trim()) return;
    setGroups((gs) => ag.addGroup(gs, newGroupName));
    setNewGroupName("");
  }

  function onRenameGroup(id, name) {
    setGroups((gs) => ag.renameGroup(gs, id, name));
  }

  function onDeleteGroup(id) {
    if (typeof window !== "undefined" && !window.confirm("Delete this group?")) return;
    setGroups((gs) => ag.removeGroup(gs, id));
  }

  function onAddAttribute(groupId) {
    const name = (newAttr[groupId] || "").trim();
    if (!name) return;
    setGroups((gs) => ag.addAttribute(gs, groupId, name));
    setNewAttr((m) => Object.assign({}, m, { [groupId]: "" }));
  }

  function onDeleteAttribute(groupId, key) {
    setGroups((gs) => ag.removeAttribute(gs, groupId, key));
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 6 }}>Attribute Groups</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Create groups to organize your product attributes (e.g., “Basic”, “Dimensions”, “SEO”).
        Saved locally in your browser.
      </p>

      <form onSubmit={onAddGroup} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="New group name"
          style={{ flex: 1, padding: "10px 12px", border: "1px solid #ccc", borderRadius: 6 }}
        />
        <button
          type="submit"
          style={{ padding: "10px 14px", borderRadius: 6, border: "1px solid #111", background: "#111", color: "#fff" }}
        >
          Add Group
        </button>
      </form>

      {groups.length === 0 ? (
        <div style={{ padding: 16, border: "1px dashed #ccc", borderRadius: 8, color: "#666" }}>
          No attribute groups yet. Create your first one above.
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {groups.map((g) => (
          <div key={g.id} style={{ border: "1px solid #e5e5e5", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <input
                value={g.name}
                onChange={(e) => onRenameGroup(g.id, e.target.value)}
                style={{ flex: 1, padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6 }}
              />
              <button
                onClick={() => onDeleteGroup(g.id)}
                title="Delete group"
                style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d00", color: "#d00", background: "#fff" }}
              >
                Delete
              </button>
            </div>

            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Attributes</div>
            {(g.attributes && g.attributes.length > 0) ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 8 }}>
                {g.attributes.map((a) => (
                  <li key={a.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                    <span style={{ flex: 1 }}>
                      <strong>{a.name}</strong>
                      <span style={{ color: "#888", marginLeft: 6 }}>(key: {a.key})</span>
                    </span>
                    <button
                      onClick={() => onDeleteAttribute(g.id, a.key)}
                      title="Remove attribute"
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #bbb", background: "#fff" }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: "#888", marginBottom: 8 }}>No attributes yet.</div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={newAttr[g.id] || ""}
                onChange={(e) => setNewAttr((m) => Object.assign({}, m, { [g.id]: e.target.value }))}
                placeholder="New attribute name (e.g., Color)"
                style={{ flex: 1, padding: "8px 10px", border: "1px solid #ccc", borderRadius: 6 }}
              />
              <button
                onClick={() => onAddAttribute(g.id)}
                style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #111", background: "#111", color: "#fff" }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
