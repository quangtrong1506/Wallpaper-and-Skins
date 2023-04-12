const {
    app,
    BrowserWindow,
    screen,
    Tray,
    Menu,
    shell,
    powerMonitor,
    Notification,
    ipcMain,
} = require('electron');
const path = require('path');
const { AppUpdater, autoUpdater } = require('electron-updater');
// biến toàn cục
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let tray = null,
    mainWindow = null,
    heightScreen,
    widthScreen;
function createWindow() {
    // Create the browser window.
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
        // icon: path.join(__dirname, './resources/app/logo.ico'),
        icon: path.join(__dirname, './src/images/logo.ico'),
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    // cho nó xuống dưới
    mainWindow.blur();
    //xóa menu mặc định
    mainWindow.removeMenu();
    // Max size
    mainWindow.maximize();
    // bỏ qua taskbar
    mainWindow.setSkipTaskbar(true);

    mainWindow.webContents.openDevTools();

    // Tray icon
    // tray = new Tray('./src/images/logo.ico');

    // build
    tray = new Tray('resources/images/logo.ico');
    let contextMenu = Menu.buildFromTemplate(trayMenu());
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Màn hình nền');
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        mainWindow.blur();
    });
    mainWindow.webContents.setWindowOpenHandler((link) => {
        return shell.openExternal(link.url);
    });
}

const singleInstanceLock = app.requestSingleInstanceLock();
app.whenReady().then(() => {
    ipcMain.on('set-notification', showNotification);
    createWindow();
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
    sendLog('check for updates');
});
/*New Update Available*/
autoUpdater.on('update-available', (info) => {
    sendLog(`Update available. Current version ${app.getVersion()}`);
    let pth = autoUpdater.downloadUpdate();
    sendLog(pth);
});

autoUpdater.on('update-not-available', (info) => {
    sendLog(`No update available. Current version ${app.getVersion()}`);
});

/*Download Completion Message*/
autoUpdater.on('update-downloaded', (info) => {
    sendLog(`Update downloaded. Current version ${app.getVersion()}`);
});

autoUpdater.on('error', (info) => {
    sendLog(info);
});

// log in javascript ?
function showNotification(event, options) {
    new Notification({
        title: options.title,
        body: options.body,
        timeoutType: 'default',
        icon: 'resources/images/logo.ico',
    }).show();
}
// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//     sendLog('Download');
//     const dialogOpts = {
//         type: 'info',
//         buttons: ['Restart', 'Later'],
//         title: 'Application Update',
//         message: process.platform === 'win32' ? releaseNotes : releaseName,
//         detail: 'A new version has been downloaded. Restart the application to apply the updates.',
//     };

//     dialog.showMessageBox(dialogOpts).then((returnValue) => {
//         if (returnValue.response === 0) autoUpdater.quitAndInstall();
//     });
// });
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

function trayMenu() {
    let innerMenu = [
        {
            label: 'Dừng',
            click: () => {
                app.quit();
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

function createNewWindow(url) {
    win = new BrowserWindow({
        width: widthScreen,
        height: heightScreen,
        resizable: true,
        frame: true,
        x: 0,
        y: 0,
        icon: path.join(__dirname, './logo.ico'),
    });

    // and load the link of the app.
    win.loadURL(url);
    //xóa menu mặc định
    win.removeMenu();
    // Max size
    win.maximize();
    win.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
}

function sendLog(message, type) {
    mainWindow.webContents.send('debug', { message: message, type: type });
}
