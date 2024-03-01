import { getGlobals } from 'common-es';
import { Menu, Tray, shell } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import CreateBackgroundWindow from './Windows/BackgroundWindow.js';
const { __dirname, __filename } = getGlobals(import.meta.url);

let Windows;
const menuItem = [
    {
        id: 0,
        label: 'Đóng ứng dụng',
        click: () => {
            app.quit();
        },
    },
    {
        id: 1,
        label: 'Open Wallpaper',
        click: () => {
            if (Windows.backgroundWindow) {
                CreateBackgroundWindow();
            }
        },
    },
    {
        id: 2,
        label: 'Open devtool',
        click: () => {},
    },
    {
        id: 3,
        label: 'Liên hệ',
        click: () => {
            shell.openExternal('https://www.facebook.com/quangtrong.1506');
        },
    },
];

const pathIcon = isDev
    ? path.join(__dirname, 'src/assets/images/logo.ico')
    : 'src/assets/images/logo.ico';
const TrayMenu = (Window) => {
    Windows = Window;
    const tray = new Tray('./src/assets/images/logo.ico');
    let contextMenu = Menu.buildFromTemplate(menuItem);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Wallpaper and Skins');
};

export default TrayMenu;
