import { observable, computed, action, decorate } from "mobx";

const themes = {
    lightTheme: {
        regularText: "rgba(0, 0, 0, .74)",
        lightText: "rgba(0, 0, 0, .44)",
        disabled: "#dddddd",
        subtle: "#ebebeb",
        backgroundColor: "white",
        inverted: "white",
        border: "rgba(60, 60, 60, 0.15)",
        inputBg: "rgba(60, 60, 60, 0.05)"
    },
    darkTheme: {
        regularText: "rgba(255, 255, 255, .87)",
        lightText: "rgba(255, 255, 255, .54)",
        backgroundColor: "#26272c",
        disabled: "#dddddd",
        subtle: "#ebebeb",
        inverted: "#444444",
        border: "#292929",
        inputBg: "rgba(255, 255, 255, 0.075)"
    }
};

class UI {
    _theme = "lightTheme";
    title = "Pan Dulce";
    needsLogin = false;
    isLoggedIn = false;

    username = "";
    password = "";

    get canSubmitLogin() {
        return !!this.username.length && !!this.password.length;
    }

    constructor() {
        window.ipcRenderer.send("init");
        window.ipcRenderer.on("login-success", () => {
            this.isLoggedIn = true;
            this.needsLogin = false;
        });

        window.ipcRenderer.on("saved-login-fail", () => {
            this.needsLogin = true;
            this.isLoggedIn = false;
        });
    }

    get appTheme() {
        return themes[this._theme];
    }

    doLogin = () => {
        // do the login
        this.username = "";
        this.password = "";
    };

    login = () => {
        window.ipcRenderer.send("saved-login");
    };

    setTitle = title => {
        this.title = title;
    };

    toggleTheme = () => {
        this._theme = this._theme === "darkTheme" ? "lightTheme" : "darkTheme";
    };
}

const DecoratedUI = decorate(UI, {
    _theme: observable,
    appTheme: computed,
    toggleTheme: action,
    isLoggedIn: observable,
    login: action,
    needsLogin: observable,
    title: observable,
    setTime: action,
    username: observable,
    password: observable,
    canSubmitLogin: computed
});

export default DecoratedUI;
