import Head from 'next/head';
import dynamic from 'next/dynamic';

const AttributeGroupsManager = dynamic(() => import('../../components/AttributeGroupsManager'), { ssr: false });

export default function AttributeGroupsPage() {
  return (
    <div style={{ padding: 24 }}>
      <Head>
        <title>Attribute Groups • Simple PIM</title>
      </Head>
      <h1 style={{ marginTop: 0 }}>Attribute Groups</h1>
      <p style={{ color: '#444' }}>Define reusable groups of attributes (e.g., Basic, SEO) to standardize product data.</p>
      <AttributeGroupsManager />
    </div>
  );
}
