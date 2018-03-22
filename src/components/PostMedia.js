import React from "react";

import Image from "components/Image";
import AlbumControls from "components/AlbumControls";
import styled from "styled-components";

const Menu = window.remote.Menu;
const MenuItem = window.remote.MenuItem;

export default class PostMedia extends React.Component {
  state = {
    showControls: false
  };

  showControls = () => {
    this.setState({ showControls: true });
  };

  hideControls = () => {
    this.setState({ showControls: false });
  };

  componentDidMount() {
    this._post.addEventListener("contextmenu", e => {
      e.preventDefault();
      const menu = new Menu();
      menu.append(
        new MenuItem({
          label: "Save Image",
          click: () => {
            window.ipcRenderer.send("init-download", {
              urls: [this.props.src]
            });
          }
        })
      );
      menu.popup(window.remote.getCurrentWindow());
    });
  }

  render() {
    const {
      width,
      height,
      src,
      alt,
      hasNext,
      hasPrev,
      onNext,
      onPrev
    } = this.props;
    const { showControls } = this.state;
    const size = {
      minWidth: width,
      maxWidth: width,
      minHeight: height,
      maxHeight: height
    };

    return (
      <div
        style={{ position: "relative" }}
        ref={r => (this._post = r)}
        onMouseEnter={this.showControls}
        onMouseLeave={this.hideControls}
      >
        <Image src={src} alt={alt} style={size} />
        <AlbumControls
          showNext={showControls && hasNext}
          showPrev={showControls && hasPrev}
          onNext={onNext}
          onPrev={onPrev}
        />
      </div>
    );
  }
}
