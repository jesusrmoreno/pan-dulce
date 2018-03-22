import React from 'react';
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Spacer = ({ height, width = "100%" }) => (
  <div style={{ height, minHeight: height, width }} />
);
