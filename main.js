import electron from 'electron';
import isDev from 'electron-is-dev';
import updater from 'electron-updater';
import path from 'path';

import CreateBackgroundWindow from './src/Windows/BackgroundWindow.js';
import ipcMainEvents from './src/helpers/ipcMainEvents.js';
const {
    BrowserWindow,
    Menu,
    Notification,
    Tray,
    app,
    ipcMain,
    powerMonitor,
    screen,
    shell,
    ipcRenderer,
    contextBridge,
} = electron;

const { autoUpdater } = updater;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
const Window = {
    backgroundWindow: null,
};
let tray = null,
    mainWindow = null,
    heightScreen,
    widthScreen;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 900,
        title: 'Live Wallpaper',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
        },
        minimizable: false,
        resizable: true,
        frame: false,
        x: 0,
        y: 0,
        icon: path.join(__dirname, './src/images/logo.ico'),
    });
    mainWindow.loadFile('index.html');
    mainWindow.blur();
    mainWindow.removeMenu();
    mainWindow.maximize();
    mainWindow.setSkipTaskbar(true);
    if (isDev) mainWindow.webContents.openDevTools();
    if (isDev) tray = new Tray('./src/assets/images/logo.ico');
    else tray = new Tray('resources/images/logo.ico');
    let contextMenu = Menu.buildFromTemplate(trayMenu());
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Màn hình nền');
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        mainWindow.blur();
    });
    mainWindow.webContents.setWindowOpenHandler((link) => {
        if (link.url.match('https://youtube.com'))
            return createNewWindow(link.url, 'resources/images/youtube.ico');
        return shell.openExternal(link.url);
    });
}
const singleInstanceLock = app.requestSingleInstanceLock();
app.whenReady().then(() => {
    // createWindow();
    Window.backgroundWindow = CreateBackgroundWindow();
    ipcMainEvents(Window.backgroundWindow);
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    widthScreen = width;
    heightScreen = height;

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    if (process.platform === 'win32') app.setAppUserModelId(app.name);
    if (!singleInstanceLock) app.quit();
    else
        app.on('second-instance', () => {
            app.focus();
        });

    powerMonitor.on('lock-screen', () => {
        mainWindow.webContents.send('lock-screen', true);
    });
    powerMonitor.on('unlock-screen', () => {
        mainWindow.webContents.send('lock-screen', false);
    });
    autoUpdater.checkForUpdates();
    setInterval(() => autoUpdater.checkForUpdates(), 5 * 60 * 1000);
});
if (!isDev)
    app.setLoginItemSettings({
        openAtLogin: true,
    });

/*New Update Available*/
autoUpdater.on('update-available', (info) => {
    sendLog(`Update available. Current version ${app.getVersion()}`);
    autoUpdater.downloadUpdate();
});

/*Download Completion Message*/

autoUpdater.on('error', (info) => {
    sendLog(info, 'error');
});
autoUpdater.on('update-downloaded', () => {
    showNotification({
        title: 'Cập nhật thành công',
        body: 'Khởi động lại ứng dụng để áp dụng các bản cập nhật',
        isUpdated: true,
    });
});

function showNotification(options) {
    var notification = new Notification({
        title: options.title,
        body: options.body,
        timeoutType: 'default',
        icon: 'resources/images/logo.ico',
        actions: [],
    });
    notification.show();
    if (options.isUpdated) {
        notification.on('click', () => {
            sendLog('click');
            mainWindow.webContents.send('relaunch-app', true);
        });
        notification.on('close', () => {
            sendLog('close');
            mainWindow.webContents.send('relaunch-app', true);
        });
    }
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

function trayMenu() {
    let innerMenu = [
        {
            label: 'Đóng ứng dụng',
            click: () => {
                app.quit();
            },
        },
        {
            label: 'Open devtool',
            click: () => {
                mainWindow.webContents.openDevTools();
            },
        },
        {
            label: 'Liên hệ',
            click: () => {
                shell.openExternal('https://www.facebook.com/quangtrong.1506');
            },
        },
    ];
    return innerMenu;
}

function sendLog(message, type) {
    console.log(message, type);
}
process.on('uncaughtException', function (err) {
    sendLog(err, 'error');
});
