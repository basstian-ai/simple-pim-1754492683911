import React from 'react';
import Head from 'next/head';
import AttributeGroupsManager from '../../components/AttributeGroupsManager';

export default function AttributeGroupsPage() {
  return (
    <>
      <Head>
        <title>Attribute Groups | Simple PIM</title>
      </Head>
      <AttributeGroupsManager />
    </>
  );
}
