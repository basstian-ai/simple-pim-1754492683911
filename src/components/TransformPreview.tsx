// TransformPreview.tsx
import React from 'react';

const TransformPreview = ({ json }) => {
  return <pre>{JSON.stringify(json, null, 2)}</pre>;
};

export default TransformPreview;
