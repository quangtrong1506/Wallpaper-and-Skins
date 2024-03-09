const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    viewToBackGround: (data) => {
        switch (data.type) {
            case "upload-video":
                ipcRenderer.send("upload-video", data.data);
                break;
            case "upload-image":
                ipcRenderer.send("upload-image", data.data);
                break;
            default:
                break;
        }
    },
    exitApp: () => {
        ipcRenderer.send("exit-background", true);
    },
    getListVideoDemo: () => {
        ipcRenderer.send("get-list-video-demo");
    },
    getListImages: () => {
        ipcRenderer.send("get-list-icon");
    },
    removeVideoUpload: (id) => {
        ipcRenderer.send("remove-video-upload", id);
    },
    removeImageUpload: (id) => {
        ipcRenderer.send("remove-image-upload", id);
    },
    openAppByShortcut: (path) => {
        ipcRenderer.send("open-app", path);
    },
});

ipcRenderer.on("upload-video-completed", (event, data) => {
    if (data)
        window.postMessage(
            {
                type: "upload-video",
                status: 200,
                data,
            },
            "*"
        );
});

ipcRenderer.on("list-video-bg", (event, data) => {
    if (data)
        window.postMessage(
            {
                type: "list-video",
                data: data,
            },
            "*"
        );
});

ipcRenderer.on("list-icon", (event, data) => {
    if (data)
        window.postMessage(
            {
                type: "list-icon",
                data: data,
            },
            "*"
        );
});

ipcRenderer.on("log", (event, data) => {
    console.log(data);
});

ipcRenderer.on("lock-screen", (event, data) => {
    window.postMessage(
        {
            type: "lock-screen",
            data,
        },
        "*"
    );
});

ipcRenderer.on("remove-video-upload-completed", (event, data) => {
    window.postMessage(
        {
            type: "remove-video-upload-completed",
            status: 200,
            data,
        },
        "*"
    );
});
