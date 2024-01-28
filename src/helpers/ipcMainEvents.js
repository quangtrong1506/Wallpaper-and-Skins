import electron from 'electron';
import { saveVideo } from '../Windows/utils/save-file.js';
const { ipcMain } = electron;
const ipcMainEvents = (mainWindow) => {
    // ipcMain.on('set-notification', getNotificationInPreload);
    ipcMain.on('quit-app', () => {
        app.quit();
    });
    ipcMain.on('confirm-relaunch', () => {
        app.relaunch();
        app.exit();
    });
    ipcMain.on('upload-video', async (event, data) => {
        const result = await saveVideo(data);
        if (result) {
            mainWindow.webContents.send('upload-video-completed', true);
        } else mainWindow.webContents.send('upload-video-completed', false);
    });
};
export default ipcMainEvents;
