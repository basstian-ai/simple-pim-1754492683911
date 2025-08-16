export let telemetryEnabled = false;

// Small in-memory buffer for quick local inspection during dev/tests.
const _events: any[] = [];

export function setTelemetryEnabled(v: boolean) {
  telemetryEnabled = !!v;
}

export function recordEvent(event: Record<string, any>) {
  // Best-effort: only record when globally enabled.
  if (!telemetryEnabled) return;

  const e = { ts: new Date().toISOString(), ...event };
  _events.push(e);
  // In a real system we'd send to an external telemetry pipeline. Keep a console log for visibility in dev.
  // eslint-disable-next-line no-console
  console.debug('[telemetry]', e);
}

export function getRecordedEvents() {
  return _events.slice();
}
