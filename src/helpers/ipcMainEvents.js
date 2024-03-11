import electron from "electron";
import path from "path";
import {
    listFiles,
    listImages,
    removeImageById,
    removeVideoById,
    saveImage,
    saveVideo,
} from "../Windows/utils/save-file.js";
const { ipcMain, powerMonitor, shell } = electron;
const ipcMainEvents = (mainWindow) => {
    // ipcMain.on('set-notification', getNotificationInPreload);
    ipcMain.on("quit-app", () => {
        app.quit();
    });
    ipcMain.on("confirm-relaunch", () => {
        app.relaunch();
        app.exit();
    });
    ipcMain.on("confirm-quit-and-install", () => {
        app.relaunch();
        app.exit();
    });

    ipcMain.on("open-app", (e, appPath) => {
        shell.openExternal(path.join(appPath));
    });

    ipcMain.on("upload-video", async (event, data) => {
        const result = await saveVideo(data);
        mainWindow.webContents.send("log", result);
        if (result.isSuccess == true) {
            mainWindow.webContents.send("upload-video-completed", result);
        } else {
            mainWindow.webContents.send("upload-video-completed", false);
            mainWindow.webContents.send("log", result);
        }
    });

    ipcMain.on("upload-image", async (event, data) => {
        const result = await saveImage(data, data.name);
        mainWindow.webContents.send("log", result);
    });

    ipcMain.on("remove-video-upload", async (event, id) => {
        const result = await removeVideoById(id);
        if (result == true) {
            mainWindow.webContents.send("remove-video-upload-completed", result);
        } else {
            mainWindow.webContents.send("remove-video-upload-completed", false);
            mainWindow.webContents.send("log", result);
        }
    });
    ipcMain.on("remove-image-upload", async (event, id) => {
        const result = await removeImageById(id);
        mainWindow.webContents.send("log", { id, result });
    });
    ipcMain.on("log", async (event, data) => {
        mainWindow.webContents.send("log", data);
    });
    ipcMain.on("exit-background", async (event, data) => {
        mainWindow.destroy();
    });
    ipcMain.on("get-list-video-demo", async (event, data) => {
        const list = await listFiles();
        mainWindow.webContents.send("list-video-bg", {
            list,
        });
    });
    ipcMain.on("get-list-icon", async (event, data) => {
        const list = await listImages();
        mainWindow.webContents.send("list-icon", {
            list,
        });
    });
    ipcMain.on("get-user-path", async (event, data) => {
        const userPath = electron.app.getPath("userData");
        mainWindow.webContents.send("user-path", {
            path: userPath,
        });
    });
    powerMonitor.on("lock-screen", () => {
        mainWindow.webContents.send("lock-screen", true);
    });
    powerMonitor.on("unlock-screen", () => {
        mainWindow.webContents.send("lock-screen", false);
    });
};
export default ipcMainEvents;
