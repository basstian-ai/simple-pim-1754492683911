type AlertPayload = {
  title: string;
  body: string;
  severity?: 'critical' | 'warning' | 'info';
  meta?: Record<string, unknown>;
};

// Minimal alerting stub. Replace with real monitoring/alerting integration
export async function sendAlert(payload: AlertPayload): Promise<void> {
  // Best-effort: don't throw from alerting to avoid masking original errors in production
  try {
    // eslint-disable-next-line no-console
    console.warn('[ALERT]', payload.title, payload);
    // Placeholder: if MONITORING_URL env exists we could POST there.
    // await fetch(process.env.MONITORING_URL!, { method: 'POST', body: JSON.stringify(payload) })
  } catch (err) {
    // swallow
  }
}
