// TransformSnippet.tsx
import React, { useState } from 'react';
import TransformPreview from './TransformPreview';

const TransformSnippet = () => {
  const [json, setJson] = useState({});

  const handleTransform = (newJson) => {
    setJson(newJson);
  };

  return (
    <div>
      <button onClick={() => handleTransform({ sample: 'data' })}>Preview</button>
      <TransformPreview json={json} />
    </div>
  );
};

export default TransformSnippet;
