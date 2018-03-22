const { createStore } = require("redux");
const { feedReducer, addFeed } = require("./stores/serverFeed");
const electron = require("electron");
const { download } = require("electron-dl");
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const url = require("url");

const windowStateKeeper = require("electron-window-state");
const path = require("path");
const Client = require("instagram-private-api").V1;
const device = new Client.Device("user_device");
const storage = new Client.CookieFileStorage(
    path.join(__dirname, "../cookies/usercookie_4.json")
);

const Promise = require("bluebird");
const uniqBy = require("lodash/uniqBy");

let session;
let feed;
let savedFeed;
let mainWindow;
let willQuitApp = false;

const store = createStore(feedReducer);

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 400,
        defaultHeight: 720
    });
    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 320,
        maxWidth: 540,
        minHeight: 500,
        titleBarStyle: "hiddenInset",
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        },
        backgroundColor: "white"
    });
    mainWindow.openDevTools();

    store.subscribe(() => {
        const { timeline } = store.getState();
        mainWindow.webContents.send("feed", timeline);
    });

    mainWindow.once("ready-to-show", async () => {
        mainWindow.show();
    });

    mainWindowState.manage(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadURL("http://localhost:3000");

    ipcMain.on("init", async () => {
        await tryLogin();

        // feed = new Client.Feed.Timeline(session);
    });

    ipcMain.on("get-feed", (e, updated) => {
        updated ? getNewPosts() : getPosts();
    });

    ipcMain.on("init-download", async (e, { urls }) => {
        console.log(urls);
        const downloads = Promise.map(
            urls,
            url => {
                return download(BrowserWindow.getFocusedWindow(), url);
            },
            { concurrency: 3 }
        );
        await downloads;
    });

    ipcMain.on("try-login", (e, { username, password }) => {
        login(username, password);
    });
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.on("close", e => {
        if (!willQuitApp) {
            e.preventDefault();
            mainWindow.hide();
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);
app.on("activate", () => mainWindow.show());
// Quit when all windows are closed.
app.on("window-all-closed", function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-quit", () => (willQuitApp = true));

app.on("activate", function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

async function getNewPosts() {
    const newPostFeed = new Client.Feed.Timeline(session);
    const res = await newPostFeed.get();
    const list = res.map(r => r.getParams());
    updateFeed(list, true);
}

async function getPosts() {
    const res = await feed.get();
    const list = res.map(r => r.getParams());
    updateFeed(list, false);
}

function updateFeed(posts, isAppend) {
    store.dispatch(addFeed({ isAppend, posts }));
}

async function login(username, password) {
    try {
        session = await Client.Session.create(
            device,
            storage,
            username,
            password
        );
        mainWindow.webContents.send("login-success");
        feed = new Client.Feed.Timeline(session);
        getPosts();
    } catch (e) {
        mainWindow.webContents.send("login-failure", e);
        console.error("could not log in using cookie");
    }
}

async function tryLogin() {
    try {
        session = await Client.Session.create(device, storage);
        getPosts();
        mainWindow.webContents.send("login-success");
    } catch (e) {
        return mainWindow.webContents.send("require-login", "Please Sign In");
    }
}

ipcMain.on("show-window", () => {
    mainWindow.show();
    mainWindow.focus();
});
