import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import times from "lodash/times";
import constant from "lodash/constant";
import { AutoSizer } from "react-virtualized";

import { PulseLoader, BounceLoader } from "react-spinners";
import Metadata from "components/Metadata";

import moment from "moment";
import Text from "components/Text";
import throttle from "lodash/throttle";
import PostMedia from "components/PostMedia";
import Image from "components/Image";
import { Column, Row, Spacer } from "components/Layout";
import { inject, observer } from "mobx-react";
const Username = ({ username }) => (
  <div>
    <Text size="f4" weight="semibold">
      {username}
    </Text>
  </div>
);

const Avatar = ({ src }) => (
  <div
    style={{ borderRadius: "100%", height: 36, width: 36, overflow: "hidden" }}
  >
    <Image src={src} />
  </div>
);

const Marker = styled.i`
  font-size: 10px;
  padding: 0px 1px;
  transition: all 250ms;
  vertical-align: middle;
  color: ${props =>
    props.active ? "rgba(62,153,237,1.00)" : props.theme.subtle};
`;

const AlbumMarkers = ({ count, index, onClick }) => (
  <div style={{ display: count > 1 ? "block" : "none" }}>
    <Spacer height={16} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {times(count, constant(null)).map((nil, i) => (
        <Marker
          active={i === index}
          key={i}
          onClick={() => onClick(i)}
          className="material-icons"
        >
          fiber_manual_record
        </Marker>
      ))}
    </div>
  </div>
);

const LikeCount = ({ likeCount, topLikers = [] }) => {
  if (likeCount && topLikers.length) {
    return (
      <Column style={{ padding: "0px 16px" }}>
        {!!likeCount && (
          <Text size="f3" weight="medium" light>
            Liked by
            <Text size="f3" weight="bold">
              {" "}
              {topLikers.join(", ")}
            </Text>{" "}
            and{" "}
            <Text size="f3" weight="bold">
              {" "}
              {likeCount - topLikers.length} others
            </Text>
          </Text>
        )}
        <Spacer height={8} />
      </Column>
    );
  }
  if (likeCount) {
    return (
      <Column style={{ padding: "0px 16px" }}>
        <Text size="f3" weight="bold">
          {likeCount} Likes
        </Text>
        <Spacer height={8} />
      </Column>
    );
  } else {
    return <div />;
  }
};

class Caption extends React.Component {
  state = {
    expanded: false
  };

  truncate = message => {
    if (message && !this.state.expanded) {
      if (message.length > 125) {
        return {
          hasMore: true,
          message: `${message.substring(0, 125).trim()}... `
        };
      }
      return { message };
    }
    return { message };
  };

  renderMessage() {
    const { hasMore, message } = this.truncate(this.props.caption);
    return (
      <Text size="f3" weight="regular">
        {message}
        {hasMore ? (
          <Text
            size="f3"
            weight="medium"
            light
            onClick={() => this.setState({ expanded: !this.state.expanded })}
          >
            more
          </Text>
        ) : null}
      </Text>
    );
  }

  render() {
    return <div style={{ padding: "0 16px" }}>{this.renderMessage()}</div>;
  }
}

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

const UserInfo = ({ avatar, username, locationName }) => (
  <Row style={{ alignItems: "center", height: 62, padding: "0px 8px" }}>
    <Avatar src={avatar} />
    <div style={{ padding: 8 }}>
      <Username username={username} />
      <Metadata>{locationName}</Metadata>
    </div>
  </Row>
);

class ImagePost extends React.Component {
  state = {
    index: 0,
    isLoaded: false,
    showControls: false
  };

  prevSlide = () => {
    this.setState(prev => {
      const index = prev.index === 0 ? 0 : prev.index - 1;
      return {
        index
      };
    });
  };

  nextSlide = () => {
    this.setState(prev => {
      const index =
        prev.index === this.props.source.length - 1
          ? prev.index
          : prev.index + 1;
      return {
        index
      };
    });
  };

  render() {
    const {
      username,
      avatar,
      source,
      timestamp = "2 Hours Ago",
      containerWidth,
      locationName,
      caption,
      likeCount,
      topLikers,
      user,
      takenAt
    } = this.props;
    const { index } = this.state;
    const ss =
      typeof source === "object" && !!source.length ? source : [source];
    const sources = ss.map(s => s.url);
    const { width, height } = ss[0];
    const h = height / width * containerWidth;
    const size = {
      minWidth: containerWidth,
      minHeight: h,
      maxHeight: h,
      maxWidth: containerWidth
    };

    const hasNext = sources.length && index < ss.length - 1;
    const hasPrev = sources.length && index > 0;

    return (
      <div>
        <UserInfo
          avatar={user.profile_pic_url}
          username={user.username}
          locationName={locationName}
        />
        <PostMedia
          src={sources[index]}
          alt={sources[index]}
          width={containerWidth}
          height={h}
          rawWidth={width}
          rawHeight={height}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onNext={this.nextSlide}
          onPrev={this.prevSlide}
        />
        <AlbumMarkers count={sources.length} index={index} />
        <Spacer height={16} />
        <LikeCount likeCount={likeCount} topLikers={topLikers} />
        <Caption caption={caption} />
        <Spacer height={8} />
        <Metadata style={{ padding: "0 16px" }}>
          {moment(takenAt).fromNow()}
        </Metadata>
        <Spacer height={32} />
      </div>
    );
  }
}

class Feed extends Component {
  handleVisit = () => {
    this.props.timeline.getPosts();
  };

  onScroll = throttle(e => {
    e.stopPropagation();
    if (this.infinite) {
      const node = ReactDOM.findDOMNode(this.infinite);
      const { top } = node.getBoundingClientRect();
      const { clientHeight } = this.container;
      if (
        top - clientHeight < clientHeight &&
        this.props.timeline.posts.length &&
        !this.props.timeline.loading
      ) {
        this.handleVisit();
      }
    }
  }, 200);

  componentWillUnmount() {
    this.container.removeEventListener("scroll", this.onScroll, false);
  }

  componentDidMount() {
    this.container.addEventListener("scroll", this.onScroll, false);
    this.props.timeline.getPosts();
  }

  render() {
    return (
      <div
        style={{ flex: 1, overflowX: "hidden" }}
        ref={r => (this.container = r)}
      >
        {!this.props.timeline.posts.length && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              height: "100%",
              width: "100vw"
            }}
          >
            <PulseLoader
              margin="8px"
              color={"#a9a9a9"}
              loading={!this.props.timeline.posts.length}
            />
          </div>
        )}
        <AutoSizer>
          {({ width }) => {
            return (
              <div style={{ width: "100vw" }}>
                {this.props.timeline.posts.map(p => (
                  <ImagePost {...p} key={p.id} containerWidth={width} />
                ))}
                <div
                  ref={r => (this.infinite = r)}
                  style={{
                    display: this.props.timeline.posts.length ? "flex" : "none",
                    height: 64,
                    width: "100vw",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <BounceLoader
                    size={8}
                    margin={80}
                    color={"#a9a9a9"}
                    loading={true}
                  />
                </div>
              </div>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}

export default inject("timeline")(observer(Feed));
