const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    viewToBackGround: (data) => {
        console.log(data);
        switch (data.type) {
            case 'upload':
                ipcRenderer.send('upload-video', data.data);
                break;
            default:
                break;
        }
    },
});
ipcRenderer.on('upload-video-completed', (event, data) => {
    console.log(data);
    window.postMessage(
        {
            type: 'upload-video-completed',
        },
        '*'
    );
});
