import { useState } from "react";

export default function AITools() {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const res = await fetch("/api/suggest-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 8 }}>AI Tools (Offline)</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Generate product name suggestions from a short description. No external AI used; runs with simple heuristics.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <label htmlFor="desc" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Product description
        </label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Soft cotton t-shirt with classic crew neck and breathable fabric"
          rows={5}
          style={{ width: "100%", padding: 12, fontSize: 14, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#111",
              color: "#fff",
              border: 0,
              borderRadius: 6,
              padding: "10px 14px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Generating..." : "Suggest Names"}
          </button>
          {error ? <span style={{ color: "#b00" }}>{error}</span> : null}
        </div>
      </form>

      {suggestions.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Suggestions</h2>
          <ul style={{ listStyle: "disc", paddingLeft: 18 }}>
            {suggestions.map((s, i) => (
              <li key={i} style={{ margin: "6px 0" }}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
