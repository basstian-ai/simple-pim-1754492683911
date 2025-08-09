import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the editor to ensure client-only features like localStorage are safe
const AttributeGroupsEditor = dynamic(() => import('../../components/AttributeGroupsEditor'), { ssr: false });

export default function AttributeGroupsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#111827', fontWeight: 700 }}>Simple PIM</a>
          <nav style={{ display: 'flex', gap: 12 }}>
            <a href="/admin/attribute-groups" style={{ color: '#2563eb' }}>Attribute Groups</a>
          </nav>
        </div>
      </header>
      <main>
        <AttributeGroupsEditor />
      </main>
    </div>
  );
}
