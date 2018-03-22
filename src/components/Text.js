// import React from 'react';
import styled from 'styled-components';

const sizes = {
  f1: '.5rem',
  f2: '.6rem',
  f3: '.75rem',
  f4: '.85rem',
  f5: '1rem',
  f6: '1.15rem',
  f7: '1.25rem',
  f8: '1.35rem',
  f9: '1.5rem',
  f10: '1.75rem',
  f11: '1.9rem',
  f12: '2rem',
  f13: '2.2rem',
  f14: '2.8rem',
  f15: '3.5rem',
};

const weights = {
  ultralight: 100,
  thin: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
  black: 900
};

const Text = styled.span`
  text-transform: ${props => props.transform};
  color: ${props => props.light ? props.theme.lightText : props.theme.regularText};
  font-size: ${props => sizes[props.size] || sizes.f4};
  font-weight: ${props => weights[props.weight] || weights.regular};
`;

export default Text;