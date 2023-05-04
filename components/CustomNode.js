import React from 'react';
import { Handle } from 'react-flow-renderer';

const MyItemNode = ({ data }) => {
  return (
    <div style={{ padding: '10px', background: data.color }}>
      <Handle type="source" position="right" />
      {data.label}
      <Handle type="target" position="left" />
    </div>
  );
};

export default MyItemNode;