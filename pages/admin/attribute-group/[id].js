import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AttributeGroupDetail from '../../../components/AttributeGroupDetail';

export default function AttributeGroupDetailPage() {
  const router = useRouter();
  const { id } = router.query || {};
  const [state, setState] = React.useState({ loading: true, error: null, group: null });

  React.useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      try {
        const res = await fetch(`/api/attribute-groups/${encodeURIComponent(id)}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to load group ${id}: ${res.status} ${text}`);
        }
        const data = await res.json();
        if (active) setState({ loading: false, error: null, group: data.group || data });
      } catch (err) {
        if (active) setState({ loading: false, error: err.message, group: null });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div style={{ padding: 20, maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ marginBottom: 12 }}>
        <Link href="/admin/attribute-groups">
          <a style={{ color: '#2563eb' }}>← Back to Attribute Groups</a>
        </Link>
      </nav>
      {state.loading ? <p>Loading…</p> : null}
      {state.error ? (
        <div style={{ color: '#b91c1c', background: '#fee2e2', padding: 12, borderRadius: 8 }}>
          {state.error}
        </div>
      ) : null}
      {!state.loading && !state.error ? <AttributeGroupDetail group={state.group} /> : null}
    </div>
  );
}
