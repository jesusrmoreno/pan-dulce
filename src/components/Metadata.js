import React from 'react';
import Text from './Text';

const Metadata = props => (
  <Text
    style={{display: 'block', padding: '0px 0px'}}
    size="f2"
    weight="semibold"
    transform="uppercase"
    light
    {...props}
  />
)

export default Metadata;