import { randomUUID } from "crypto";
import electron, { Notification } from "electron";
import fse from "fs-extra";
import path from "path";
const userPath = electron.app.getPath("userData");
const showNotification = (options = { title: "Test", body: "Thông báo từ admin" }) => {
    let notification = new Notification({
        ...options,
    });
    notification.show();
};
const saveVideo = async (data, name = randomUUID()) => {
    let fileType = data.type?.split("/")[1] || "mp4";
    try {
        await fse.copy(data.path, path.join(userPath, `/assets/videos/${name}.${fileType}`));
        return {
            id: name,
            path: path.join(userPath, `/assets/videos/${name}.${fileType}`),
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
            const check = await fse.pathExists(path.join(userPath, `/assets/images/shortcut/`));
            if (!check) await fse.ensureDir(path.join(userPath, `/assets/images/shortcut/`));
            await fse.writeFile(
                path.join(userPath, `/assets/images/shortcut/${name}.png`),
                buffer,
                { flag: "w+" }
            );
        } else
            await fse.copy(data.path, path.join(userPath, `/assets/images/shortcut/${name}.png`));
        return {
            id: name,
            path: `/assets/images/shortcut/${name}.png`,
            isSuccess: true,
        };
    } catch (error) {
        console.log(error);
        showNotification({ title: "Error", body: error.message + "Line: 48" });
        return error;
    }
};
const removeVideoById = async (id) => {
    let fileName = id + ".mp4";
    try {
        await fse.remove(path.join(userPath, `/assets/videos/${fileName}`));
        return true;
    } catch (error) {
        if (error.code === "EBUSY")
            setTimeout(() => {
                removeVideoById(id);
            }, 5000);
        console.log(error);
        return error;
    }
};
const removeImageById = async (id) => {
    let fileName = id + ".png";
    try {
        await fse.remove(path.join(userPath, `/assets/images/shortcut/${fileName}`));
        return true;
    } catch (error) {
        if (error.code === "EBUSY")
            setTimeout(() => {
                removeVideoById(id);
            }, 5000);
        console.log(error);
        return error;
    }
};
// Danh sách video đã tải lên
const listFiles = async () => {
    const check = await fse.pathExists(path.join(userPath, `/assets/videos/`));
    if (!check) await fse.ensureDir(path.join(userPath, `/assets/videos/`));
    let files = fse.readdirSync(path.join(userPath, `/assets/videos/`));
    const list = [];
    files.forEach((file) => {
        list.push({
            id: file.split(".")[0],
            path: path.join(userPath, `/assets/videos/` + file),
        });
    });
    return list;
};
// Danh sách ảnh (icon shortcut) có sẵn
const listImages = () => {
    const list = fse.readdirSync(path.join(electron.app.getAppPath(), `/src/assets/images/icons/`));
    return list;
};
export { listFiles, listImages, removeImageById, removeVideoById, saveImage, saveVideo };
