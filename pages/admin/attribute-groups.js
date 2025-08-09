import React, { useEffect, useMemo, useState } from "react";
const core = require("../../lib/attributeGroupsCore");

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, [key]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function Input({ label, value, onChange, placeholder, style }) {
  return (
    <label style={{ display: "block", marginBottom: 8, ...style }}>
      <span style={{ display: "block", fontSize: 12, color: "#555" }}>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 8, width: "100%", boxSizing: "border-box" }}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "block", marginBottom: 8 }}>
      <span style={{ display: "block", fontSize: 12, color: "#555" }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: 8, width: "100%" }}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function AdminAttributeGroupsPage() {
  const [groups, setGroups] = useLocalStorageState("attributeGroups", []);
  const [newGroupName, setNewGroupName] = useState("");
  const types = core.DEFAULT_ATTRIBUTE_TYPES;

  const addGroup = () => {
    try {
      const next = core.createGroup(groups, { name: newGroupName });
      setGroups(next);
      setNewGroupName("");
    } catch (e) {
      alert(e.message);
    }
  };

  const updateGroupName = (id, name) => {
    try {
      setGroups(core.updateGroup(groups, id, { name }));
    } catch (e) {
      alert(e.message);
    }
  };

  const removeGroup = (id) => {
    if (!confirm("Delete this attribute group?")) return;
    try {
      setGroups(core.deleteGroup(groups, id));
    } catch (e) {
      alert(e.message);
    }
  };

  const addAttr = (groupId, draft) => {
    try {
      setGroups(core.addAttribute(groups, groupId, draft));
    } catch (e) {
      alert(e.message);
    }
  };

  const updateAttr = (groupId, code, updates) => {
    try {
      setGroups(core.updateAttribute(groups, groupId, code, updates));
    } catch (e) {
      alert(e.message);
    }
  };

  const removeAttr = (groupId, code) => {
    if (!confirm("Delete this attribute?")) return;
    try {
      setGroups(core.deleteAttribute(groups, groupId, code));
    } catch (e) {
      alert(e.message);
    }
  };

  // Seed with an example group if empty (client-only)
  useEffect(() => {
    if (!groups || groups.length === 0) {
      try {
        const seeded = core.createGroup([], { name: "Basics" });
        const withAttr = core.addAttribute(seeded, seeded[0].id, {
          code: "sku",
          label: "SKU",
          type: "text",
        });
        setGroups(withAttr);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: "20px auto", padding: 20, fontFamily: "-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Attribute Groups</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Manage attribute groups and fields for your product information. Data is saved in your browser's localStorage.
      </p>

      <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>Create Group</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={newGroupName}
            placeholder="Group name (e.g., Specifications)"
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addGroup();
            }}
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={addGroup} style={{ padding: "8px 12px" }}>
            Add
          </button>
        </div>
      </div>

      {groups.map((g) => (
        <GroupCard
          key={g.id}
          group={g}
          types={types}
          onRename={(name) => updateGroupName(g.id, name)}
          onDelete={() => removeGroup(g.id)}
          onAddAttr={(draft) => addAttr(g.id, draft)}
          onUpdateAttr={(code, updates) => updateAttr(g.id, code, updates)}
          onDeleteAttr={(code) => removeAttr(g.id, code)}
        />
      ))}

      {groups.length === 0 && (
        <div style={{ color: "#777" }}>No attribute groups yet. Create your first group above.</div>
      )}
    </div>
  );
}

function GroupCard({ group, types, onRename, onDelete, onAddAttr, onUpdateAttr, onDeleteAttr }) {
  const [name, setName] = useState(group.name);
  useEffect(() => setName(group.name), [group.name]);

  const [draftAttr, setDraftAttr] = useState({ code: "", label: "", type: types[0] });

  const valid = useMemo(() => core.validateGroup(group), [group]);

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: 8, fontWeight: 600 }}
        />
        <button onClick={() => onRename(name)} style={{ padding: "8px 12px" }}>Save</button>
        <button onClick={onDelete} style={{ padding: "8px 12px", color: "#a00" }}>Delete</button>
      </div>
      {!valid.valid && (
        <ul style={{ color: "#a00", marginTop: 8 }}>
          {valid.errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 16 }}>
        <h4 style={{ margin: "8px 0" }}>Attributes</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th style={{ padding: 8 }}>Code</th>
              <th style={{ padding: 8 }}>Label</th>
              <th style={{ padding: 8 }}>Type</th>
              <th style={{ padding: 8, width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {group.attributes.map((a) => (
              <AttributeRow key={a.code} a={a} types={types} onUpdate={(u) => onUpdateAttr(a.code, u)} onDelete={() => onDeleteAttr(a.code)} />
            ))}
            {group.attributes.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 8, color: "#777" }}>
                  No attributes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px 120px", gap: 8, marginTop: 12 }}>
          <input
            value={draftAttr.code}
            placeholder="code"
            onChange={(e) => setDraftAttr({ ...draftAttr, code: e.target.value })}
            style={{ padding: 8 }}
          />
          <input
            value={draftAttr.label}
            placeholder="label"
            onChange={(e) => setDraftAttr({ ...draftAttr, label: e.target.value })}
            style={{ padding: 8 }}
          />
          <select
            value={draftAttr.type}
            onChange={(e) => setDraftAttr({ ...draftAttr, type: e.target.value })}
            style={{ padding: 8 }}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              onAddAttr(draftAttr);
              setDraftAttr({ code: "", label: "", type: types[0] });
            }}
            style={{ padding: "8px 12px" }}
          >
            Add attribute
          </button>
        </div>
      </div>
    </div>
  );
}

function AttributeRow({ a, types, onUpdate, onDelete }) {
  const [code, setCode] = useState(a.code);
  const [label, setLabel] = useState(a.label);
  const [type, setType] = useState(a.type);

  useEffect(() => setCode(a.code), [a.code]);
  useEffect(() => setLabel(a.label), [a.label]);
  useEffect(() => setType(a.type), [a.type]);

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      <td style={{ padding: 8 }}>
        <input value={code} onChange={(e) => setCode(e.target.value)} style={{ width: "100%", padding: 6 }} />
      </td>
      <td style={{ padding: 8 }}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} style={{ width: "100%", padding: 6 }} />
      </td>
      <td style={{ padding: 8 }}>
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", padding: 6 }}>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </td>
      <td style={{ padding: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onUpdate({ code, label, type })} style={{ padding: "6px 10px" }}>
            Update
          </button>
          <button onClick={onDelete} style={{ padding: "6px 10px", color: "#a00" }}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
