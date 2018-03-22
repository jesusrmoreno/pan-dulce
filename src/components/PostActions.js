import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 16px;
`;

const Icon = styled.i.attrs({className: 'material-icons'})`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconButton = ({icon}) => (
  <Action>
    <Icon>{icon}</Icon>
  </Action>
);

const Action = styled.div`
  text-align: center;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class PostActions extends React.Component {
  render() {
    return (
      <Container>
        <IconButton icon="crop_original" />
        <IconButton icon="favorite_border" />
        <IconButton icon="save" />
      </Container>
    );
  }
}
