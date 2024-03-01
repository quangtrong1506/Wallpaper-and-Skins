import { randomUUID } from "crypto";
import isDev from "electron-is-dev";
import fse from "fs-extra";
import path from "path";
const PATH = isDev ? "./src/assets" : "./resources";
const __dirname = path.resolve();
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
        return error;
    }
};
const saveImage = async (data, name = randomUUID()) => {
    let fileType = data.type?.split("/")[1] || "png";
    try {
        await fse.copy(
            data.path,
            path.join(__dirname, `${PATH}/images/shortcut/${name}.${fileType}`)
        );
        return {
            id: name,
            path: `${PATH}/images/shortcut/${name}.${fileType}`,
            isSuccess: true,
        };
    } catch (error) {
        console.log(error);
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
const listFiles = () => {
    const list = fse.readdirSync(path.join(__dirname, `${PATH}/videos/`));
    return list;
};
export { listFiles, removeVideoById, saveImage, saveVideo };
