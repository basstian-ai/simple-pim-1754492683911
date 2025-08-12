import React, { useEffect, useMemo, useState } from "react";
import slugify from "../../lib/slugify";

export default function SlugifyTool() {
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => slugify(value), [value]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = slug;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Slugify Tool</h1>
        <p style={styles.help}>Convert product names to clean, SEO-friendly slugs. Great for URLs, handles, and SKU helpers.</p>
        <label style={styles.label} htmlFor="name">Product name</label>
        <input
          id="name"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Café Crème 250g – Limited Edition!"
          style={styles.input}
        />

        <label style={styles.label} htmlFor="slug">Slug</label>
        <div style={styles.slugRow}>
          <input id="slug" type="text" value={slug} readOnly style={{ ...styles.input, flex: 1 }} />
          <button onClick={onCopy} disabled={!slug} style={styles.button}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <details style={styles.details}>
          <summary style={styles.summary}>What does this do?</summary>
          <ul style={styles.ul}>
            <li>Lowercases text</li>
            <li>Removes accents (é → e)</li>
            <li>Converts spaces/underscores to hyphens</li>
            <li>Strips symbols and collapses repeats</li>
          </ul>
        </details>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fafafa",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#fff",
    border: "1px solid #eaeaea",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  h1: { margin: 0, fontSize: 24 },
  help: { color: "#666", marginTop: 8, marginBottom: 16 },
  label: { display: "block", fontWeight: 600, marginTop: 16, marginBottom: 8 },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #e1e1e1",
    outline: "none",
  },
  slugRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },
  button: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 12px",
    cursor: "pointer",
    minWidth: 84,
  },
  details: { marginTop: 12 },
  summary: { cursor: "pointer" },
  ul: { marginTop: 8, color: "#444" },
};
