import React from "react";

import styled from "styled-components";

const AlbumControl = styled.div`
  vertical-align: middle;
  opacity: ${props => (props.show ? 1 : 0)};
  align-items: center;
  width: 24px;
  height: 24px;
  transition: all 100ms;

  i {
    background-color: rgba(255, 255, 255, 0.54);
    border-radius: 100%;
    transition: all 100ms;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.27);
    &:hover {
      background-color: rgba(255, 255, 255, 0.87);
    }
  }
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 10;
  padding: 16px;
`;

const AlbumControls = ({ onNext, onPrev, showPrev, showNext }) => (
  <Container>
    <AlbumControl show={showPrev}>
      <i className="material-icons" onClick={onPrev}>
        navigate_before
      </i>
    </AlbumControl>
    <div style={{flex: 1}}/>
    <AlbumControl show={showNext}>
      <i className="material-icons" onClick={onNext}>
        navigate_next
      </i>
    </AlbumControl>
  </Container>
);

export default AlbumControls;