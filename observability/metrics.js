/**
 * Lightweight in-memory Prometheus-like metrics helper.
 * Provides counters, gauges and histograms and a simple exposition format.
 * This is intentionally tiny — for production use, wire a Prometheus client.
 */

function labelsKey(name, labels) {
  const keys = labels ? Object.keys(labels).sort() : [];
  if (keys.length === 0) return name + "{}";
  return (
    name +
    "{" +
    keys.map((k) => `${k}="${String(labels[k]).replace(/"/g, '\"') }"`).join(",") +
    "}"
  );
}

class Metrics {
  constructor() {
    this.counters = Object.create(null);
    this.gauges = Object.create(null);
    this.histograms = Object.create(null);
  }

  inc(name, labels = {}, value = 1) {
    const key = labelsKey(name, labels);
    this.counters[key] = (this.counters[key] || 0) + Number(value);
  }

  gaugeSet(name, labels = {}, value = 0) {
    const key = labelsKey(name, labels);
    this.gauges[key] = Number(value);
  }

  histogramObserve(name, labels = {}, value) {
    const key = labelsKey(name, labels);
    if (!this.histograms[key]) this.histograms[key] = [];
    this.histograms[key].push(Number(value));
  }

  // A minimal Prometheus exposition as text/plain
  exposition() {
    const lines = [];
    Object.keys(this.counters).forEach((k) => {
      lines.push(`# TYPE ${k.split("{")[0]} counter`);
      lines.push(`${k} ${this.counters[k]}`);
    });
    Object.keys(this.gauges).forEach((k) => {
      lines.push(`# TYPE ${k.split("{")[0]} gauge`);
      lines.push(`${k} ${this.gauges[k]}`);
    });
    Object.keys(this.histograms).forEach((k) => {
      const samples = this.histograms[k];
      const sum = samples.reduce((a, b) => a + b, 0);
      const count = samples.length;
      lines.push(`# TYPE ${k.split("{")[0]} histogram`);
      lines.push(`${k}_sum ${sum}`);
      lines.push(`${k}_count ${count}`);
    });
    return lines.join("\n") + (lines.length ? "\n" : "");
  }
}

module.exports = { Metrics };
