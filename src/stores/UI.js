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
    isLoggingIn = false;
    username = "";
    password = "";
    errorMessage = null;

    get canSubmitLogin() {
        return (
            !!this.username.length &&
            !!this.password.length &&
            !this.isLoggingIn
        );
    }

    constructor() {
        window.ipcRenderer.send("init");
        window.ipcRenderer.on("login-success", () => {
            this.isLoggedIn = true;
            this.needsLogin = false;
            this.isLoggingIn = false;
            this.username = "";
            this.password = "";
            this.errorMessage = null;
        });

        window.ipcRenderer.on("require-login", () => {
            this.needsLogin = true;
            this.isLoggedIn = false;
        });

        window.ipcRenderer.on("login-failure", (e, error) => {
            console.log(error);
            this.needsLogin = true;
            this.isLoggedIn = false;
            this.password = "";
            this.isLoggingIn = false;
            this.errorMessage = error.message;
        });
    }

    get appTheme() {
        return themes[this._theme];
    }

    doLogin = () => {
        window.ipcRenderer.send("try-login", {
            username: this.username,
            password: this.password
        });
        this.isLoggingIn = true;
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
    isLoggingIn: observable,
    canSubmitLogin: computed,
    errorMessage: observable
});

export default DecoratedUI;
