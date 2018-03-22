import React from "react";
import Feed from "pages/Feed";
import Text from "components/Text";
import TitleBar from "components/Titlebar";
import styled, { ThemeProvider } from "styled-components";
import { Column, Row, Spacer } from "components/Layout";
import Image from "components/Image";
import UIStore from "stores/UI";
import TimelineStore from "stores/Timeline";
import { inject, observer } from "mobx-react";
import { Provider } from "mobx-react";

const stores = {
  ui: new UIStore(),
  timeline: new TimelineStore()
};

const Main = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100vw;
  transition: background-color 150ms;
`;

const UserName = ({ fullname, username, ...props }) => (
  <Column
    {...props}
    style={{ height: 40, maxHeight: 40, justifyContent: "center" }}
  >
    <Text size="f4" weight="semibold">
      {fullname}
    </Text>
    <Spacer height={2} />
    <Text size="f2" weight="semibold" light transform="uppercase">
      {username}
    </Text>
  </Column>
);

const UserStat = ({ count, label, ...props }) => (
  <Column {...props}>
    <Text size="f3" weight="semibold">
      {count}
    </Text>
    <Text size="f2" weight="semibold" light transform="uppercase">
      {label}
    </Text>
  </Column>
);

const Avatar = ({ containerProps, ...props }) => (
  <div
    style={{
      minHeight: 64,
      minWidth: 64,
      height: 64,
      width: 64,
      borderRadius: 72,
      overflow: "hidden"
    }}
    {...containerProps}
  >
    <Image {...props} />
  </div>
);

const UserInfoContainer = styled(Row)`
  padding: 16px 16px;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

class UserAccount extends React.Component {
  render() {
    return (
      <UserInfoContainer>
        <Avatar src={"https://i.redd.it/xmvfxkd18hwz.jpg"} />
        <Column style={{ flex: 1, padding: "0px 16px" }}>
          <UserName fullname="Minatozaki Sana" username="@no_sana_no_life" />
          <Row
            style={{
              justifyContent: "space-between",
              height: 32,
              alignItems: "center"
            }}
          >
            <UserStat label="Posts" count={337} />
            <UserStat label="Followers" count={337} />
            <UserStat label="Following" count={337} />
          </Row>
        </Column>
      </UserInfoContainer>
    );
  }
}

const ThemeWrapper = inject("ui")(
  observer(({ children, ui, ...props }) => {
    return <ThemeProvider theme={ui.appTheme}>{children}</ThemeProvider>;
  })
);

const StyledInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
  background-color: transparent;
  color: inherit;
  font-size: 0.85rem;
`;

const InputContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.inputBg};
  color: ${props => props.theme.regularText};
  padding: 8px;
  border-radius: 2px;

  i {
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    font-size: 16px;
    max-width: 32px;
    min-width: 32px;
  }
`;

const Input = ({ icon = "favorite", ...props }) => {
  return (
    <div>
      <InputContainer>
        <div>
          <i className="material-icons">{icon}</i>
        </div>
        <StyledInput {...props} />
      </InputContainer>
    </div>
  );
};

const PrimaryButton = styled.button`
  outline: 0;
  border: 0;
  background: ${p => (p.disabled ? "grey" : "#469df6")};
  color: white;
  padding: 8px 20px;
  transition: all 100ms;
  font-weight: 600;
  border-radius: 2px;
`;

const RequireLogin = inject("ui")(
  observer(
    ({ ui, children }) =>
      ui.isLoggedIn
        ? children
        : ui.needsLogin && (
            <div
              style={{
                position: "relative",
                top: -15,
                flex: 1,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                padding: "0px 32px"
              }}
            >
              <Text size="f12" weight="bold">
                Sign In
              </Text>
              <Spacer height={16} />
              <div style={{ width: "100%" }}>
                <Input
                  placeholder="Username"
                  icon="account_circle"
                  autoFocus
                  onChange={e => (ui.username = e.target.value)}
                  value={ui.username}
                />
                <Spacer height={4} />
                <Input
                  placeholder="Password"
                  type="password"
                  icon="lock_outline"
                  onChange={e => (ui.password = e.target.value)}
                  value={ui.password}
                />
              </div>
              <Spacer height={16} />
              <PrimaryButton
                style={{ width: "100%" }}
                disabled={!ui.canSubmitLogin}
                onClick={ui.doLogin}
              >
                Login
              </PrimaryButton>
            </div>
          )
  )
);

class App extends React.Component {
  componentDidMount() {
    document.addEventListener("dragover", this.preventDefault);
    document.addEventListener("drop", this.preventDefault);
  }

  preventDefault = event => event.preventDefault();

  componentWillUnmount() {
    document.removeEventListener("dragover", this.preventDefault);
    document.removeEventListener("drop", this.preventDefault);
  }

  render() {
    return (
      <Provider {...stores}>
        <ThemeWrapper>
          <Main>
            <TitleBar title={stores.ui.title} />
            <RequireLogin>
              <Feed />
            </RequireLogin>
          </Main>
        </ThemeWrapper>
      </Provider>
    );
  }
}

export default observer(App);
