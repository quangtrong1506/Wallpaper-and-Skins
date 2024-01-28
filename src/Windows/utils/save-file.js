import fse from 'fs-extra';
import path from 'path';
const __dirname = path.resolve();
const saveVideo = async (data) => {
    let fileType = data.type?.split('/')[1] || 'mp4';
    try {
        await fse.copy(
            data.path,
            path.join(__dirname, './src/assets/videos/bg-upload.' + fileType)
        );
        return true;
    } catch (error) {
        return false;
    }
};
export { saveVideo };
