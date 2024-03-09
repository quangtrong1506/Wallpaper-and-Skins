import { randomUUID } from "crypto";
import electron, { Notification } from "electron";
import isDev from "electron-is-dev";
import fse from "fs-extra";
import path from "path";
const PATH = isDev ? "./src/assets" : "./resources";
// const __dirname = path.resolve();
const __dirname = electron.app.getAppPath().replace("\\resources\\app.asar", "");
const showNotification = (options = { title: "Test", body: "" }) => {
    let notification = new Notification({
        ...options,
        icon: path.join(__dirname, PATH + "/images/logo.ico"),
    });
    notification.show();
};
const saveVideo = async (data, name = randomUUID()) => {
    let fileType = data.type?.split("/")[1] || "mp4";
    try {
        await fse.copy(data.path, path.join(__dirname, `${PATH}/videos/${name}.${fileType}`));
        return {
            id: name,
            path: `${PATH}/videos/${name}.${fileType}`,
            isSuccess: true,
        };
    } catch (error) {
        console.log(error);
        showNotification({ title: "Error", body: error.message + "Line: 26" });
        return error;
    }
};
const saveImage = async (data, name = randomUUID()) => {
    let fileType = data.type || "png";
    try {
        if (fileType === "base64") {
            const buffer = Buffer.from(data.path, "base64");
            const check = await fse.pathExists(path.join(__dirname, `${PATH}/images/shortcut/`));
            if (!check) await fse.ensureDir(path.join(__dirname, `${PATH}/images/shortcut/`));
            await fse.writeFile(
                path.join(__dirname, `${PATH}/images/shortcut/${name}.png`),
                buffer,
                { flag: "w+" }
            );
        } else
            await fse.copy(data.path, path.join(__dirname, `${PATH}/images/shortcut/${name}.png`));
        return {
            id: name,
            path: `${PATH}/images/shortcut/${name}.png`,
            isSuccess: true,
        };
    } catch (error) {
        console.log(error);
        showNotification({ title: "Error", body: error.message + "Line: 48" });
        return error;
    }
};
let idInterval = null;
const removeVideoById = async (id) => {
    let fileName = id + ".mp4";
    try {
        await fse.remove(path.join(__dirname, `${PATH}/videos/${fileName}`));
        if (idInterval) clearInterval(idInterval);
        return true;
    } catch (error) {
        if (error.code === "EBUSY")
            idInterval = setInterval(() => {
                removeVideoById(id);
            }, 5000);
        console.log(error);
        return error;
    }
};
const removeImageById = async (id) => {
    let fileName = id + ".png";
    try {
        await fse.remove(path.join(__dirname, `${PATH}/images/shortcut/${fileName}`));
        if (idInterval) clearInterval(idInterval);
        return true;
    } catch (error) {
        if (error.code === "EBUSY")
            idInterval = setInterval(() => {
                removeVideoById(id);
            }, 5000);
        console.log(error);
        return error;
    }
};
const listFiles = () => {
    const list = fse.readdirSync(path.join(__dirname, `${PATH}/videos/`));
    return list;
};
const listImages = () => {
    const list = fse.readdirSync(path.join(__dirname, `${PATH}/images/icons/`));
    return list;
};
export { listFiles, listImages, removeImageById, removeVideoById, saveImage, saveVideo };
