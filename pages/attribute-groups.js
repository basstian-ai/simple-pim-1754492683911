import React from 'react';
import AttributeGroupList from '../components/AttributeGroupList';
import { getAttributeGroups } from '../lib/attributeGroups';

export default function AttributeGroupsPage({ groups }) {
  return (
    <div style={{ maxWidth: 900, padding: 24, margin: '0 auto' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Attribute Groups</h1>
        <p style={{ color: '#4b5563' }}>
          Organize product attributes into reusable groups. This helps keep your catalog consistent and manageable.
        </p>
      </header>
      <AttributeGroupList groups={groups} />
    </div>
  );
}

export async function getServerSideProps() {
  // Server-side render from shared lib to avoid cross-origin fetch issues
  const groups = getAttributeGroups();
  return { props: { groups } };
}
