export type DryRunError = Error & {
  code?: string | number;
  status?: number;
  details?: any;
  // for AJV-style errors
  errors?: Array<{ instancePath?: string; message?: string; schemaPath?: string; params?: any }>;
};

export type DryRunErrorResult = {
  title: string;
  message: string;
  details?: string;
  suggestion?: string;
  docsUrl?: string;
};

const DOCS_URL = "https://docs.example.com/pim/dry-run-json-preview#error-messages";

function joinLines(lines: Array<string | undefined | null>): string {
  return lines.filter(Boolean).join("\n\n");
}

export function formatDryRunError(err: DryRunError | unknown, context?: { payloadPreview?: string | object }): DryRunErrorResult {
  // Defensive normalization
  const e = (err as DryRunError) || ({} as DryRunError);
  const message = String(e.message || e || "Unknown error");
  const name = String(e.name || "Error");

  // AJV / schema validation style
  if (Array.isArray((e as any).errors) && (e as any).errors.length > 0) {
    const ajvErrors = (e as any).errors as Array<any>;
    const details = ajvErrors
      .map((ae) => {
        const path = ae.instancePath || ae.dataPath || "<root>";
        const msg = ae.message ? ` ${ae.message}` : "";
        return `• ${path}:${msg}`;
      })
      .join("\n");

    return {
      title: "Schema validation failed",
      message: "The transform produced JSON that does not match the expected schema.",
      details,
      suggestion: "Check the listed paths and types. Common fixes: ensure required fields are present, types match (string vs number), and arrays/objects have expected shapes.",
      docsUrl: DOCS_URL,
    };
  }

  // Raw JSON syntax errors from JSON.parse
  if (name === "SyntaxError" || /Unexpected token|JSON.parse/.test(message)) {
    const detailLines: string[] = [];
    detailLines.push("The JSON output from your transform failed to parse.");
    if (context?.payloadPreview) {
      detailLines.push("Preview (truncated):");
      const preview = typeof context.payloadPreview === "string" ? context.payloadPreview : JSON.stringify(context.payloadPreview, null, 2);
      detailLines.push(preview.substring(0, 2000));
    }

    return {
      title: "Invalid JSON produced",
      message: joinLines(detailLines),
      details: message,
      suggestion: "Check for trailing commas, unescaped quotes, and functions/unserializable values in the transform. Use a JSON linter or `JSON.stringify` to produce valid JSON.",
      docsUrl: DOCS_URL,
    };
  }

  // Network / adapter errors
  if (String(e.code || "").match(/ECONNREFUSED|ECONNRESET|ENOTFOUND/) || (e.status && Number(e.status) >= 500)) {
    return {
      title: "Adapter / network error",
      message: "An error occurred while contacting an external adapter or service used during the dry-run.",
      details: message,
      suggestion: "Retry the dry-run. If the problem persists, check adapter credentials, network connectivity, and the external service health.",
      docsUrl: DOCS_URL,
    };
  }

  // Typical runtime transform errors (undefined path, reading properties of undefined)
  if (name === "TypeError" || /cannot read property|is not a function|undefined/.test(message)) {
    const suggestion = "This often means a path in the transform referenced a missing value (e.g. product.color when color is absent). Add existence checks, optional chaining (?.), or default values in the transform.":
    return {
      title: "Transform runtime error",
      message: "An error happened while running the transform that generates the dry-run payload.",
      details: message,
      suggestion,
      docsUrl: DOCS_URL,
    };
  }

  // Authorization / client errors
  if ((e.status && Number(e.status) >= 400 && Number(e.status) < 500) || /Unauthorized|403|forbidden/i.test(message)) {
    return {
      title: "Permission or request error",
      message: "The dry-run failed due to a request or permission issue.",
      details: message,
      suggestion: "Check API keys, scopes, and request payloads. Confirm the account used for the dry-run has required permissions.",
      docsUrl: DOCS_URL,
    };
  }

  // Fallback generic error
  return {
    title: "Dry-run failed",
    message: "An unexpected error occurred during dry-run JSON preview.",
    details: message,
    suggestion: "Inspect the details and transform logic. If you cannot resolve this, please open a support ticket with the error details and a reproducible payload.",
    docsUrl: DOCS_URL,
  };
}
