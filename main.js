<<<<<<< HEAD
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

let tray = null,
    mainWindow = null,
    heightScreen,
    widthScreen;
=======
const { app, BrowserWindow, screen, globalShortcut, Tray, Menu, shell } = require('electron');
const path = require('path');
const { off } = require('process');
let tray = null,
    mainWindow = null;

>>>>>>> 192bd5eb993b5f3fd24bbd9546f0ad99936ba406
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 900,
<<<<<<< HEAD
        title: 'Live Wallpaper',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
=======
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
>>>>>>> 192bd5eb993b5f3fd24bbd9546f0ad99936ba406
        },
        minimizable: false,
        resizable: true,
        frame: false,
        x: 0,
        y: 0,
<<<<<<< HEAD
        // icon: path.join(__dirname, './resources/app/logo.ico'),
        icon: path.join(__dirname, './src/images/logo.ico'),
=======
>>>>>>> 192bd5eb993b5f3fd24bbd9546f0ad99936ba406
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

<<<<<<< HEAD
    // mainWindow.webContents.openDevTools();

    // Tray icon
    // tray = new Tray('./src/images/logo.ico');

    // build
    tray = new Tray('resources/images/logo.ico');
    let contextMenu = Menu.buildFromTemplate(trayMenu());
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Màn hình nền');
=======
    mainWindow.webContents.openDevTools();

    // Tray icon
    tray = new Tray('./src/images/logo.ico');
    let contextMenu = Menu.buildFromTemplate(trayMenu());
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Màn hình nền tự build');

>>>>>>> 192bd5eb993b5f3fd24bbd9546f0ad99936ba406
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        mainWindow.blur();
    });
<<<<<<< HEAD
    mainWindow.webContents.setWindowOpenHandler((link) => {
        return shell.openExternal(link.url);
    });
}

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
});

function showNotification(event, options) {
    new Notification({
        title: options.title,
        body: options.body,
        timeoutType: 'default',
        icon: 'resources/images/logo.ico',
    }).show();
}
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

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
=======
}

function trayMenu() {
    var text = mainWindow.isVisible() ? 'Ẩn hình nền' : 'Hiện hình nền';
    let innerMenu = [
        {
            label: 'Dừng',
            click: () => {
                app.quit();
            },
        },
        {
            label: text,
            click: () => {
                mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
                mainWindow.blur();

                let contextMenu = Menu.buildFromTemplate(trayMenu());
                tray.setContextMenu(contextMenu);
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

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
>>>>>>> 192bd5eb993b5f3fd24bbd9546f0ad99936ba406
