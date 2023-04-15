const { ipcRenderer, contextBridge } = require('electron');
const brightness = require('brightness');
const { speaker } = require('win-audio');
const cmd = require('node-cmd');

// nhận dữ liệu khi khóa màn hình
var lock = false;
ipcRenderer.on('lock-screen', function (event, data) {
    console.log('lock');
    if (data) lock = true;
    else lock = false;
});

ipcRenderer.on('debug', function (event, data) {
    if (data.type == 'error') console.error('main.js: ' + data.message);
    else if (data.type == 'warn') console.warn('main.js: ' + data.message);
    else console.log('main.js: ' + data.message);
});
ipcRenderer.on('relaunch-app', function (event, data) {
    Swal.fire({
        title: 'Xác nhận khởi động lại ứng dụng?',
        showDenyButton: true,
        confirmButtonText: 'Khởi động lại',
        denyButtonText: `Để sau`,
    }).then((result) => {
        if (result.isConfirmed) confirmRelaunch();
    });
});

const setBrightness = async function setBrightness(value) {
    value = value > 1 ? 1 : value < 0 ? 0 : value;
    await brightness
        .set(value)
        .then(() => {
            console.log('Changed brightness to ' + value);
        })
        .catch(() => {
            console.log('Lỗi thay đổi độ sáng màn hình', 'error');
        });
};

const setMute = (value) => {
    if (value) speaker.mute();
    else speaker.unmute();
};
const setAudio = async (value) => {
    try {
        speaker.set(value);
    } catch (e) {
        sendLog('Lỗi chỉnh âm lượng');
    }
};
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (options) => ipcRenderer.send('set-notification', options),
    setBrightness: setBrightness,
    setMute: setMute,
    setAudio: setAudio,
    isLocked: () => {
        return lock;
    },
    openInCMD: OpenInCMD,
    getDataSystem: getDataSystem,
    isMuted: isMuted,
    quitApp: () => ipcRenderer.send('quit-app'),
    confirmRelaunch: () => ipcRenderer.send('confirm-relaunch'),
});

async function getDataSystem() {
    let audio = await speaker.get();
    let mute = await speaker.isMuted();
    if (mute) {
        document.getElementById('audio-bell').classList.remove('unmute');
        document.getElementById('audio-bell').classList.add('muted');
    } else {
        document.getElementById('audio-bell').classList.add('unmute');
        document.getElementById('audio-bell').classList.remove('muted');
    }
    document.getElementById('audio').value = audio / 2;
}
function isMuted() {
    return speaker.isMuted();
}
setInterval(getDataSystem, 1000);
function OpenInCMD(path) {
    console.log('cmd: ' + path);
    cmd.run(path);
}
