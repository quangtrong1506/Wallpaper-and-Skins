import { getGlobals } from "common-es";
import electron, { Menu } from "electron";
import isDev from "electron-is-dev";
import storage from "electron-json-storage";
import updater from "electron-updater";
import path from "path";
import CreateBackgroundWindow from "./src/Windows/BackgroundWindow.js";
import { TRAY_ITEMS } from "./src/constant.js";
import ipcMainEvents from "./src/helpers/ipcMainEvents.js";

// Biến toàn cục hoặc biến config
//? const import
const { BrowserWindow, Notification, Tray, app, screen, shell } = electron;
const { __dirname, __filename } = getGlobals(import.meta.url);
//? Config auto update
const { autoUpdater } = updater;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
//? Const
const WINDOWS = {
    backgroundWindow: null,
    tray: null,
};
const defaultSettings = {
    showWallpaper: true,
    showWeather: true,
};
const Settings = { ...defaultSettings };
let a = null,
    mainWindow = null,
    heightScreen,
    widthScreen;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 900,
        title: "Live Wallpaper",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
        },
        minimizable: false,
        resizable: true,
        frame: false,
        x: 0,
        y: 0,
        icon: path.join(__dirname, "./src/images/logo.ico"),
    });
    mainWindow.loadFile("index.html");
    mainWindow.blur();
    mainWindow.removeMenu();
    mainWindow.maximize();
    mainWindow.setSkipTaskbar(true);
    if (isDev) mainWindow.webContents.openDevTools();

    mainWindow.webContents.setWindowOpenHandler((link) => {
        return shell.openExternal(link.url);
    });
}
app.whenReady().then(() => {
    if (!storage.getSync("settings")) storage.set("settings", defaultSettings);
    else {
        const data = storage.getSync("settings");
        for (let x in data) {
            Settings[x] = data[x];
        }
    }
    WINDOWS.tray = new Tray(path.join(__dirname, "./src/assets/images/logo.ico"));
    WINDOWS.tray.setToolTip("Wallpaper and Skins");
    if (Settings.showWallpaper) createWallpaperWindow();
    if (WINDOWS.backgroundWindow) {
        TRAY_ITEMS.push({
            id: "background",
            label: "Mở Devtools Wallpaper",
            click: () => {
                WINDOWS.backgroundWindow.webContents.openDevTools();
            },
        });
        const contextMenu = Menu.buildFromTemplate(TRAY_ITEMS);
        WINDOWS.tray.setContextMenu(contextMenu);
    }
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    widthScreen = width;
    heightScreen = height;
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    if (process.platform === "win32") app.setAppUserModelId(app.name);
    if (!app.requestSingleInstanceLock()) app.quit();
    else
        app.on("second-instance", () => {
            app.focus();
        });
    autoUpdater.checkForUpdates();
    setInterval(() => autoUpdater.checkForUpdates(), 5 * 60 * 1000);
});
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
const createWallpaperWindow = () => {
    WINDOWS.backgroundWindow = CreateBackgroundWindow();
    ipcMainEvents(WINDOWS.backgroundWindow);
};
if (!isDev)
    app.setLoginItemSettings({
        openAtLogin: true,
    });

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
    sendLog(`Update available. Current version ${app.getVersion()}`);
    autoUpdater.downloadUpdate();
});

/*Download Completion Message*/

autoUpdater.on("error", (info) => {});
autoUpdater.on("update-downloaded", () => {});
process.on("uncaughtException", function (err) {
    alert("Error: " + err.message);
});
