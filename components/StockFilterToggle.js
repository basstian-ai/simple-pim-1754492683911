import React from 'react';

export default function StockFilterToggle({ checked, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label="Show in-stock products only"
      />
      In stock only
    </label>
  );
}
