import React from "react";
import styled from "styled-components";

const TitleBar = styled.div.attrs({ className: "draggable" })`
  height: 35px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  width: 100vw;
  z-index: 10;
  position: relative;
  letter-spacing: 0px;
  vertical-align: middle;
  text-align: center;
  white-space: nowrap;
  font-weight: 600;
  color: ${props => props.theme.regularText};
  text-overflow: ellipsis;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial,
    sans-serif;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const BarSection = ({ width = 42, children }) => (
  <div style={{ width, minWidth: width }}>{children}</div>
);

const AppBar = ({title}) => (
  <TitleBar>
    <BarSection />
    <div style={{ flex: 1 }}>{title}</div>
    <BarSection />
  </TitleBar>
);

export default AppBar;
