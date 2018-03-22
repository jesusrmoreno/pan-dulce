import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  position: relative;
`;

const ImageCover = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: ${props => props.isLoaded ? 0 : 1};
  background-color: ${props => props.theme.subtle};
  transition: all 100ms;
`;

export default class Image extends React.Component {
  state = {
    isLoaded: false,
  };

  componentWillReceiveProps(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.setState({
        isLoaded: false,
      });
    }
  }

  handleLoad = () => this.setState({isLoaded: true});

  render() {
    const {isLoaded} = this.state;
    return (
      <ImageContainer>
        <img {...this.props} onLoad={this.handleLoad} />
        <ImageCover isLoaded={isLoaded} />
      </ImageContainer>
    )
  }
};