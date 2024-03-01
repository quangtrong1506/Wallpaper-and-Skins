const videoPathDefault = {
    path: "../../assets/videos/bg-default.mp4",
    id: "bg-default",
};
let bgState = {
    isPlay: true,
    videoUpload: null,
    videoId: videoPathDefault.id,
    videoIdSelect: null,
};
const DEFAULT_IMAGE_PATH = "../../assets/images/logo.png";
const isDev = localStorage.getItem("isDev");
const listVideoShow = [];
const rootPathVideo = isDev ? "../../assets/videos/" : "../../../../videos/";
const ROOT_PATH_IMAGE_SHORTCUT = isDev
    ? "../../assets/images/shortcut/"
    : "../../../../images/shortcut/";
const SHORTCUTS = {
    size: "sm",
    items: [
        {
            id: null,
            path: null,
            iconPath: null,
            title: null,
            isHidden: false,
            x: 0,
            y: 0,
        },
    ],
};
const customId = () => {
    let id = new Date().getTime();
    return id.toString();
};
if (isDev) {
    console.log("Hi! Developer");
}
//Load lần đầu chạy app
window.onload = () => {
    document.querySelector("body.swal2-height-auto")?.classList.remove("swal2-height-auto");
    setMainLanguage();
    //Add event
    document.getElementById("video-background").addEventListener("click", () => {
        showMenu(false);
    });
    //Load state
    if (localStorage.getItem("bg-state")) {
        bgState = JSON.parse(localStorage.getItem("bg-state"));
    }
    //Set text menu
    // setStateVideo();
    setText();
    setViewSelectLanguage();
    setInterval(() => {
        if (bgState.isPlay && document.getElementById("video-background").paused) playVideo(true);
    }, 1000);
    if (localStorage.getItem("shortcuts")) {
        let shortcuts = JSON.parse(localStorage.getItem("shortcuts"));
        SHORTCUTS.size = shortcuts.size;
        SHORTCUTS.items = shortcuts.items;
    } else SHORTCUTS.items = [];
    showShortcut();
    electronAPI?.getListVideoDemo();
};
const handleImageError = (event) => {
    event.target.src = DEFAULT_IMAGE_PATH;
};
//? Mouse Events
const mouseLeaveEvent = () => {
    showMenu(false);
    SHORTCUTS.items.forEach((item) => handleOnmouseleaveOptionShortcut(item.id));
};

const mousedownEvent = (event) => {
    event.preventDefault();
    let state = {
        button: event.button,
        x: event.x,
        y: event.y,
    };
    SHORTCUTS.items.forEach((item) => handleOnmouseleaveOptionShortcut(item.id));
    if (state.button == 2) showMenu(true, state.x, state.y);
};

window.addEventListener("contextmenu", (e) => e.preventDefault());
//- End Mouse events

// Menu
const showMenu = (state, x = 0, y = 0) => {
    let bodyState = {
        w: document.body.clientWidth,
        h: document.body.clientHeight,
    };
    let menuState = {
        w: document.querySelector(".menu").clientWidth,
        h: document.querySelector(".menu").clientHeight,
    };
    let menu = document.querySelector(".menu");
    if (state === true) {
        if (!menu.classList.contains("active")) menu.classList.add("active");
        if (x + menuState.w > bodyState.w) menu.style.left = bodyState.w - menuState.w + "px";
        else menu.style.left = x + "px";
        if (y + menuState.h > bodyState.h) menu.style.top = bodyState.h - menuState.h + "px";
        else menu.style.top = y + "px";
    } else {
        if (menu.classList.contains("active")) menu.classList.remove("active");
    }
};

const exitApp = () => {
    window.electronAPI?.exitApp();
};

//? State
const saveBgSate = () => {
    delete bgState.videoIdSelect;
    localStorage.setItem("bg-state", JSON.stringify(bgState));
};

//? Video
const setStateVideo = () => {
    playVideo(bgState.isPlay);
    bgState.isPlay
        ? (document.getElementById("text-video-state").innerText = text.menu.video.pause)
        : (document.getElementById("text-video-state").innerText = text.menu.video.play);
};

const playVideo = (state) => {
    if (
        (state === true || state === undefined) &&
        document.getElementById("video-background").paused
    )
        document.getElementById("video-background").play();
    else if (!document.getElementById("video-background").paused)
        document.getElementById("video-background").pause();
};

const changeStateVideo = () => {
    if (bgState.isPlay) bgState.isPlay = false;
    else bgState.isPlay = true;
    setStateVideo();
};
//Mở memu lựa chọn video
const showMenuChangeVideo = (state) => {
    if (state === true || state === undefined) {
        if (!document.querySelector(".change-video").classList.contains("active"))
            document.querySelector(".change-video").classList.add("active");
        document.getElementById("video-demo-upload").src =
            bgState.videoId == videoPathDefault.id
                ? videoPathDefault.path
                : rootPathVideo + bgState.videoId + ".mp4";
        setActiveVideoDemo(
            bgState.videoId == videoPathDefault.id ? videoPathDefault.id : bgState.videoId
        );
    } else document.querySelector(".change-video").classList.remove("active");
};

// Upload
const uploadVideoChangeEvent = (event) => {
    if (!event.files[0]) return;
    console.log(event.files[0].path);
    // document.querySelector('.video-name').innerHTML = event.files[0].name;
    let src = URL.createObjectURL(event.files[0]);
    bgState.videoUpload = event.files[0];
    document.getElementById("video-demo-upload").src = src;
    Swal.fire({
        title: "Uploading video",
        html: text.uploadingVideo,
        showConfirmButton: false,
        confirmButtonText: text.background,
        // denyButtonText: text.cancel,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    setTimeout(() => {
        Electron_sendData(
            {
                type: "upload-video",
                data: {
                    path: bgState.videoUpload.path,
                    type: bgState.videoUpload.type,
                },
                description: "Tải video mới lên",
            },
            100
        );
    });
};
// chỉnh path nền video
const setNewPathVideoBackground = (path) => {
    document.getElementById("video-background").src = path;
    playVideo(bgState.isPlay);
};
//Lưu video mới
const saveNewVideo = () => {
    showMenuChangeVideo(false);
    bgState.videoId = bgState.videoIdSelect;
    setNewPathVideoBackground(rootPathVideo + bgState.videoId + ".mp4");
    saveBgSate();
};
// khi video background bị lỗi
const videoPathError = () => {
    console.error(bgState);
    bgState.videoId = videoPathDefault.id;
    saveBgSate();
    setNewPathVideoBackground(videoPathDefault.path);
    Swal.fire({
        text: text.videoBackgroundError,
        icon: "info",
    });
};
// Dặt lại mặc định
const resetVideoBackground = () => {
    Swal.fire({
        title: text.setToDefault,
        icon: "question",
        showDenyButton: true,
        confirmButtonText: text.confirm,
        denyButtonText: text.cancel,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            bgState.videoId = videoPathDefault.id;
            saveBgSate();
            showMenu(false);
            showMenuChangeVideo(false);
            setNewPathVideoBackground(videoPathDefault.path);
            Swal.fire(text.success, "", "success");
        }
    });
};
// xem video demo khi lựa chọn
const setActiveVideoDemo = (id) => {
    let arr = document.querySelectorAll(".list-videos .list .item");
    arr.forEach((item) => {
        item.classList.remove("active");
        if (item.id === id) item.classList.add("active");
    });
    if (id === videoPathDefault.id) arr[1].classList.add("active");
    else {
        listVideoShow.forEach((video) => (video.isActive = false));
        let tmp = listVideoShow.find((video) => video.id == id);
        if (tmp) tmp.isActive = true;
    }
    document.getElementById("video-demo-upload").src =
        listVideoShow.find((video) => video.id === id)?.path || videoPathDefault.path;
    document.getElementById("video-demo-upload").play();
    bgState.videoIdSelect = id;
};
// Hiện thị khi thêm video
const addVideoShow = (video) => {
    const div = document.createElement("div");
    div.className = video.isActive ? "item active" : "item";
    div.id = video.id;
    div.innerHTML = `<video src='${video.path}' onclick="setActiveVideoDemo('${video.id}')"></video>
                        <div class="action-btn">
                            <div class="play--btn" onclick="setActiveVideoDemo('${video.id}')">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                >
                                    <path
                                        d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                                    />
                                </svg>
                            </div>
                            <div class="remove--btn" onclick="removeVideoUpload('${video.id}')">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                >
                                    <path
                                        d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                                    />
                                </svg>
                            </div>
                        </div>`;
    document.querySelector(".list-videos .list").appendChild(div);
};
// Xoá 1 video
const removeVideoUpload = (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            let video = listVideoShow.find((video) => video.id === id);
            if (video.id === bgState.videoId) {
                setNewPathVideoBackground(videoPathDefault.path);
                bgState.videoId = videoPathDefault.path;
                saveBgSate();
            }
            if (video && video.isActive) {
                setActiveVideoDemo(videoPathDefault.id);
            }
            setTimeout(() => {
                electronAPI.removeVideoUpload(id);
                document.getElementById(id)?.remove();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                });
            }, 100);
        }
    });
};
//-End Video

//?Language
//Set Text Language
const setText = () => {
    document.querySelectorAll(".text-change-video").forEach((element) => {
        element.innerHTML = text.menu.video.changeVideo;
    });
    document.querySelectorAll(".text-save").forEach((element) => {
        element.innerHTML = text.save;
    });
    document.querySelectorAll(".text-reset").forEach((element) => {
        element.innerHTML = text.reset;
    });
    document.querySelectorAll(".text-upload").forEach((element) => {
        element.innerHTML = text.menu.video.uploadVideo;
    });
    document.querySelectorAll(".text-select-language").forEach((element) => {
        element.innerHTML = text.language.text;
    });
    document.querySelectorAll(".text-open-settings").forEach((element) => {
        element.innerHTML = text.openMainSetting;
    });
    document.querySelectorAll(".text-exit").forEach((element) => {
        element.innerHTML = text.exit;
    });
    bgState.isPlay
        ? (document.getElementById("text-video-state").innerText = text.menu.video.pause)
        : (document.getElementById("text-video-state").innerText = text.menu.video.play);
};
const setViewSelectLanguage = () => {
    document.querySelector(".menu-language").innerHTML = "";
    listOfLanguages.forEach((lang) => {
        let element = document.createElement("div");
        element.className = "menu__item";
        element.innerHTML = `
            <label>${lang.name}</label>
            <span class="${
                localStorage.getItem("language") === lang.code ? "checked" : ""
            } right-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                    />
                </svg>
            </span>`;
        element.addEventListener("click", () => {
            setLanguage(lang.code);
        });
        document.querySelector(".menu-language").appendChild(element);
    });
};
const setLanguage = (code) => {
    localStorage.setItem("language", code);
    setMainLanguage();
    setViewSelectLanguage();
    setText();
};
const showMenuLanguage = (state) => {
    if (state === true || state === undefined) {
        if (!document.querySelector(".menu-language").classList.contains("active"))
            document.querySelector(".menu-language").classList.add("active");
    } else document.querySelector(".menu-language").classList.remove("active");
};

//
//ElectronJS
const Electron_sendData = (
    data = {
        type: -1,
        data: null,
        description: "",
        other: null,
        ...data,
    }
) => {
    window.electronAPI?.viewToBackGround(data);
};

// showMenuChangeVideo(true);

//? ICON
// Drag
const dragElement = (elmnt) => {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elmnt.onmousedown = (event) => {
        if (event.button === 0) dragMouseDown();
    };

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        let top =
            elmnt.offsetTop - pos2 < 0
                ? 0
                : elmnt.offsetTop - pos2 > document.body.clientHeight - elmnt.clientHeight
                ? document.body.clientHeight - elmnt.clientHeight
                : elmnt.offsetTop - pos2;
        let left =
            elmnt.offsetLeft - pos1 < 0
                ? 0
                : elmnt.offsetLeft - pos1 > document.body.clientWidth - elmnt.clientWidth
                ? document.body.clientWidth - elmnt.clientWidth
                : elmnt.offsetLeft - pos1;
        // set the element's new position:

        elmnt.style.top = top + "px";
        elmnt.style.left = left + "px";
        let sc = SHORTCUTS.items.find((s) => s.id === elmnt.id);
        sc.x = left;
        sc.y = top;
        saveShortcut();
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
};
const showShortcut = () => {
    document.getElementById("list-shortcut").innerHTML = "";
    SHORTCUTS.items.forEach((sc) => {
        let elmnt = document.createElement("div");
        elmnt.id = sc.id;
        elmnt.className = "app-icon__item " + SHORTCUTS.size;
        elmnt.draggable = true;
        elmnt.style.left =
            (sc.x > document.body.clientWidth ? document.body.clientWidth - 75 : sc.x) + "px";
        elmnt.style.top =
            (sc.y > document.body.clientHeight ? document.body.clientHeight - 75 : sc.y) + "px";
        if (sc.isHidden) elmnt.style.display = "none";
        elmnt.innerHTML = `
                    <div style="position:relative" onmousedown="mousedownInIcon(event,'${sc.id}')">
                        <div class="icon">
                            <img src="${
                                ROOT_PATH_IMAGE_SHORTCUT + sc.iconPath
                            }" alt="..." onerror="handleImageError(event)" />
                        </div>
                        <div class="title">${sc.title}</div>
                        <div class="options options-${
                            sc.id
                        }" onmouseleave="handleOnmouseleaveOptionShortcut('${sc.id}')">
                            <ul>
                                <li onclick="openAppByShortcut('${sc.path}')">Mở</li>
                                <li onclick="showEditShortcutItem('${sc.id}');">Chỉnh sửa</li>
                                <li>Xoá</li>
                            </ul>
                    </div>
                    </div>`;
        document.getElementById("list-shortcut").appendChild(elmnt);
        dragElement(elmnt);
    });
};
const handleInputPath = (event) => {
    event.target.value = event.target.value
        .trim()
        .replaceAll("//", "/")
        .replaceAll("\\\\", "/")
        .replaceAll("\\", "/")
        .replaceAll(/\"/g, "")
        .replaceAll(/\'/g, "");
};
const showEditShortcutItem = (id) => {
    let item = SHORTCUTS.items.find((item) => item.id === id);
    Swal.fire({
        title: "Chỉnh sửa Shortcut",
        html: `<div class="swal-shortcut-group">
                <label>Title</label>
                <input id="swal-input-name" type="text" value="${
                    item?.title || ""
                }" placeholder="Your application name">
            </div>
            <div class="swal-shortcut-group">
                <label>Path</label>
                <input id="swal-input-path" type="text" value="${
                    item?.path || ""
                }" placeholder="Your application path" oninput="handleInputPath(event)">
            </div>
            <div class="swal-shortcut-group">
                <label class="icon-label">Icon</label>
                <img id="shortcut-icon-${item?.id || "new"}" src="${
            item?.iconPath || DEFAULT_IMAGE_PATH
        }" width="50"/>
                <label for="input-change-shortcut-icon" class="change-icon">Change</label>
                <input id="input-change-shortcut-icon" type="file" accept="image/*" style="display:none" onchange="handleChangeShortcutIcon(this)" >
            </div>
        `,
        preConfirm: () => {
            if (!document.getElementById("swal-input-name").value)
                return Swal.showValidationMessage(`Your application name is required`);
            if (!document.getElementById("swal-input-path").value)
                return Swal.showValidationMessage(`Your application path is required`);
            return [
                document.getElementById("swal-input-name").value,
                document.getElementById("swal-input-path").value,
                document
                    .getElementById("shortcut-icon-" + (item?.id || "new"))
                    .getAttribute("data-path"),
            ];
        },
        showLoaderOnConfirm: true,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: `Lưu`,
        cancelButtonText: `Huỷ`,
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        let id = item?.id || customId();
        if (result.isConfirmed == true) {
            SHORTCUTS.items.push({
                id,
                iconPath: id + ".png",
                path: result.value[1],
                title: result.value[0],
                isHidden: false,
                x: 500,
                y: 300,
            });
            saveShortcut();
            Electron_sendData({
                type: "upload-image",
                data: {
                    path: result.value[2],
                    type: "png",
                    name: id,
                },
                description: "Upload image Shortcut",
            });
            setTimeout(() => {
                showShortcut();
            }, 500);
        }
    });
};

const handleChangeShortcutIcon = (event) => {
    let file = event.files[0];
    console.log(file);
    document.querySelector(".swal-shortcut-group img").src = URL.createObjectURL(file);
    document.querySelector(".swal-shortcut-group img").setAttribute("data-path", file.path);
};
const mousedownInIcon = (event, id) => {
    event.preventDefault();
    if (event.button == 2) {
        SHORTCUTS.items.forEach((item) => handleOnmouseleaveOptionShortcut(item.id));
        document.querySelector(".app-icon .options-" + id).classList.contains("active")
            ? {}
            : document.querySelector(".app-icon .options-" + id).classList.add("active");
    }
};
const handleOnmouseleaveOptionShortcut = (id) => {
    document.querySelector(".app-icon .options-" + id)?.classList.remove("active");
};
const saveShortcut = () => {
    localStorage.setItem("shortcuts", JSON.stringify(SHORTCUTS));
};

showEditShortcutItem();
const openAppByShortcut = (path) => {
    electronAPI.openAppByShortcut(path);
};
// Get messages
window.addEventListener("message", (event) => {
    if (event.source === window) {
        // console.log(event.data);
        switch (event.data.type) {
            case "upload-video":
                if (event.data?.status === 200) {
                    Swal.fire("Tải video lên thành công", "", "success");
                    addVideoShow({
                        id: event.data.data.id,
                        path: rootPathVideo + event.data.data.id + ".mp4",
                    });
                    listVideoShow.push({
                        id: event.data.data.id,
                        path: rootPathVideo + event.data.data.id + ".mp4",
                        isActive: false,
                    });
                    setActiveVideoDemo(event.data.data.id);
                } else
                    Swal.fire({
                        text: "Error upload video",
                        icon: "error",
                    });
                break;
            case "lock-screen":
                if (event.data.data === true) playVideo(false);
                else if (bgState.isPlay === true) playVideo(true);
                break;
            case "list-video":
                event.data.data.list.forEach((name) => {
                    let id = name.split(".")[0];
                    if (id != videoPathDefault.id)
                        listVideoShow.push({
                            id,
                            path: rootPathVideo + name,
                        });
                });
                listVideoShow.forEach((video) => {
                    addVideoShow(video);
                });
                const elmt = listVideoShow.find((video) => {
                    return video.id == bgState.videoId;
                });
                setNewPathVideoBackground(
                    bgState.videoId == videoPathDefault.id ? videoPathDefault.path : elmt?.path
                );
                break;
            case "remove-video-upload-completed":
                break;
            default:
                // console.log(event.data);
                break;
        }
    }
});
