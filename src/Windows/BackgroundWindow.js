import electron from 'electron';
import isDev from 'electron-is-dev';
import fileSaver from 'file-saver';
import path from 'path';
const __dirname = path.resolve();
const { BrowserWindow, contextBridge, ipcRenderer } = electron;
const CreateBackgroundWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1300,
        height: 900,
        minimizable: false,
        resizable: true,
        frame: false,
        x: 0,
        y: 0,
        webPreferences: {
            preload: path.join(__dirname, 'src/Windows/preload/background-window.preload.js'),
            // nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
        },
        icon: path.join(__dirname, 'src/assets/images/logo.ico'),
    });
    mainWindow.loadFile('./src/Windows/views/background.html');
    mainWindow.maximize();
    if (!isDev) {
        mainWindow.blur();
        mainWindow.removeMenu();
        mainWindow.setSkipTaskbar(true);
    }
    if (isDev) mainWindow.webContents.openDevTools();
    //Function
    const saveVideo = (data) => {
        fileSaver.saveAs(data);
    };
    return mainWindow;
};

export default CreateBackgroundWindow;
