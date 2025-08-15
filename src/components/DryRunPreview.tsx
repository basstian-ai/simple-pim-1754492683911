import React from "react";
import { formatDryRunError } from "../utils/dryRunError";

export type DryRunPreviewProps = {
  previewJson?: object | string | null;
  error?: unknown;
};

export function DryRunPreview({ previewJson, error }: DryRunPreviewProps) {
  if (error) {
    const parsed = formatDryRunError(error, { payloadPreview: previewJson });

    return (
      <div role="alert" aria-live="polite" style={{ border: "1px solid #f5c6cb", padding: 12, borderRadius: 6, background: "#fff5f5" }}>
        <strong style={{ display: "block", marginBottom: 6 }}>{parsed.title}</strong>
        <div style={{ whiteSpace: "pre-wrap", marginBottom: 8 }}>{parsed.message}</div>
        {parsed.details && <details style={{ fontSize: 12, color: "#333" }}><summary>Details</summary><pre style={{ overflowX: "auto" }}>{parsed.details}</pre></details>}
        {parsed.suggestion && <div style={{ marginTop: 8, fontSize: 13 }}><strong>Suggested fix:</strong> {parsed.suggestion}</div>}
        {parsed.docsUrl && <div style={{ marginTop: 8 }}><a href={parsed.docsUrl} target="_blank" rel="noreferrer">Error docs & troubleshooting</a></div>}
      </div>
    );
  }

  if (!previewJson) {
    return <div style={{ color: "#666" }}>No preview available.</div>;
  }

  const pretty = typeof previewJson === "string" ? previewJson : JSON.stringify(previewJson, null, 2);

  return (
    <pre style={{ background: "#0f1724", color: "#e6edf3", padding: 12, borderRadius: 6, overflowX: "auto" }}>
      {pretty}
    </pre>
  );
}

export default DryRunPreview;
