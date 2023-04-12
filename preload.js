const brightness = require('brightness');
const { ipcRenderer, contextBridge } = require('electron');
const { speaker } = require('win-audio');
const cmd = require('node-cmd');

// nhận dữ liệu khi khóa màn hình
var lock = false;
ipcRenderer.on('lock-screen', function (event, data) {
    if (data) lock = true;
    else lock = false;
});
ipcRenderer.on('debug', function (event, data) {
    if (data.type == 'error') console.error('main.js: ' + data.message);
    else if (data.type == 'warn') console.warn('main.js: ' + data.message);
    else console.log('main.js: ' + data.message);
});
const setBrightness = async function setBrightness(value) {
    value = value > 1 ? 1 : value < 0 ? 0 : value;
    await brightness
        .set(value)
        .then(() => {
            console.log('Changed brightness to ' + value);
        })
        .catch(() => {
            alert('Lỗi thay đổi độ sáng màn hình');
        });
};
const getBrightness = async () => {
    var level = await brightness.get();
    return level;
};
const getAudio = async () => {
    var level = await speaker.get();
    return level;
};
const isMuted = () => {
    return speaker.isMuted();
};
const isLocked = () => {
    return lock;
};
const lockScreen = () => {
    try {
        cmd.run('C:/Windows/System32/rundll32.exe');
    } catch (e) {
        console.log('lỗi cái gì đó');
    }
};

const setMute = (value) => {
    if (value) speaker.mute();
    else speaker.unmute();
};
const setAudio = async (value) => {
    try {
        speaker.set(value);
    } catch (e) {
        alert('Lỗi chỉnh âm lượng');
    }
};

const turnOfWindows = () => {
    cmd.run('C:/Windows/System32/SlideToShutDown.exe');
};

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (options) => ipcRenderer.send('set-notification', options),
    setBrightness: setBrightness,
    isMuted: isMuted,
    lockScreen: lockScreen,
    setMute: setMute,
    setAudio: setAudio,
    turnOfWindows: turnOfWindows,
    getBrightness: getBrightness,
    getAudio: getAudio,
    isLocked: isLocked,
});
