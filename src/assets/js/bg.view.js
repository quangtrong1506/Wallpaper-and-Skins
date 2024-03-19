const videoPathDefault = {
    path: "../../assets/videos/bg-default.mp4",
    id: "bg-default",
};

let user_path = null;
const DEFAULT_IMAGE_PATH = "../../assets/images/logo.png";
const isDev = localStorage.getItem("isDev");
const listVideoShow = [];
const rootPathVideo = isDev ? "../../assets/videos/" : "../../../../videos/";
const ROOT_ICO_PATH = isDev ? "../../assets/images/icons/" : "../../assets/images/icons/";
const ROOT_BG_START = {
    isPlay: true,
    videoUpload: null,
    videoId: videoPathDefault.id,
    videoIdSelect: null,
};
let bgState = { ...ROOT_BG_START };
const customId = () => {
    let id = new Date().getTime();
    return id.toString();
};
//Load lần đầu chạy app
window.onload = () => {
    if (!localStorage.getItem("isWeb")) {
        electronAPI?.getDataPath();
        electronAPI?.getListVideoDemo();
        electronAPI?.getListImages();
    }
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
    //Todo: setStateVideo();
    setTextLabel();
    setViewSelectLanguage();
    setInterval(() => {
        if (bgState.isPlay && document.getElementById("video-background").paused) playVideo(true);
    }, 1000);
    if (localStorage.getItem("shortcuts")) {
        let shortcuts = JSON.parse(localStorage.getItem("shortcuts"));
        SHORTCUTS.size = shortcuts.size;
        SHORTCUTS.items = shortcuts.items;
        SHORTCUTS.isAutoSort = shortcuts.isAutoSort;
        if (SHORTCUTS.isAutoSort) sortShortcut();
    } else SHORTCUTS.items = [];
    showShortcut();
    showSelectSizeShortcut();
};
const handleImageError = (event) => {
    if (!event.target.src.match("logo")) event.target.src = DEFAULT_IMAGE_PATH;
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

const showMenu = (state, x = 0, y = 0) => {
    closeAllMenuLevel2();
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
        ? (document.getElementById("text-video-state").innerText = text.text_menu_video_pause)
        : (document.getElementById("text-video-state").innerText = text.text_menu_video_play);
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
    showMenu(false);
    if (state === true || state === undefined) {
        if (!document.querySelector(".change-video").classList.contains("active"))
            document.querySelector(".change-video").classList.add("active");
        document.getElementById("video-demo-upload").src =
            bgState.videoId == videoPathDefault.id
                ? videoPathDefault.path
                : user_path + "/assets/videos/" + bgState.videoId + ".mp4";
        setActiveVideoDemo(
            bgState.videoId == videoPathDefault.id ? videoPathDefault.id : bgState.videoId
        );
    } else document.querySelector(".change-video").classList.remove("active");
};

//Todo: Upload
const uploadVideoChangeEvent = (event) => {
    if (!event.files[0]) return;
    //Todo: document.querySelector('.video-name').innerHTML = event.files[0].name;
    let src = URL.createObjectURL(event.files[0]);
    bgState.videoUpload = event.files[0];
    document.getElementById("video-demo-upload").src = src;
    Swal.fire({
        title: "Uploading video",
        html: text.text_uploading_video,
        showConfirmButton: false,
        confirmButtonText: text.text_background,
        //Todo: denyButtonText: text.cancel,
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
//Todo: chỉnh path nền video
const setNewPathVideoBackground = (path) => {
    document.getElementById("video-background").src = path;
    playVideo(bgState.isPlay);
};
//Lưu video mới
const saveNewVideo = () => {
    showMenuChangeVideo(false);
    bgState.videoId = bgState.videoIdSelect;
    setNewPathVideoBackground(
        bgState.videoId === videoPathDefault.id
            ? videoPathDefault.path
            : user_path + "/assets/videos/" + bgState.videoId + ".mp4"
    );
    saveBgSate();
};
//Todo: khi video background bị lỗi
const videoPathError = () => {
    bgState.videoId = videoPathDefault.id;
    saveBgSate();
    setNewPathVideoBackground(videoPathDefault.path);
    Swal.fire({
        text: text.text_video_background_error,
        icon: "info",
    });
};
//Todo: Dặt lại mặc định
const resetVideoBackground = () => {
    Swal.fire({
        title: text.text_set_to_default,
        icon: "question",
        showDenyButton: true,
        confirmButtonText: text.text_confirm,
        denyButtonText: text.text_cancel,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            bgState = ROOT_BG_START;
            saveBgSate();
            showMenu(false);
            showMenuChangeVideo(false);
            setNewPathVideoBackground(videoPathDefault.path);
            Swal.fire(text.text_success, "", "success");
        }
    });
};
//Todo: xem video demo khi lựa chọn
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
//Todo: Hiện thị khi thêm video
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
//Todo: Xoá 1 video
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
    setTextLabel();
};
const showMenuLanguage = (state) => {
    if (state === true || state === undefined) {
        if (!document.querySelector(".menu-language").classList.contains("active")) {
            document.querySelector(".menu-language").classList.add("active");
            showMenuShortcutSize(false);
        }
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

//Todo: showMenuChangeVideo(true);

//Todo: Get messages

let SHORTCUT_API_PAGE = 1;
const SHORTCUT_API_LIMIT = 20;
window.addEventListener("message", (event) => {
    console.log(event.data);
    if (event.source === window) {
        switch (event.data.type) {
            case "upload-video":
                if (event.data?.status === 200) {
                    Swal.fire(text.text_the_video_has_been_uploaded_successfully, "", "success");
                    addVideoShow({
                        id: event.data.data.id,
                        path: event.data.data.path,
                    });
                    listVideoShow.push({
                        id: event.data.data.id,
                        path: event.data.data.path,
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
                event.data.data.list.forEach((video) => {
                    if (video.id != videoPathDefault.id)
                        listVideoShow.push({
                            id: video.id,
                            path: video.path,
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
            case "list-icon":
                event.data.data.list.forEach((name) => {
                    let div = document.createElement("div");
                    div.classList = "item";
                    div.innerHTML = `<img src="${ROOT_ICO_PATH + name}"
                     alt="${ROOT_ICO_PATH + name}"/>`;
                    div.onclick = (e) => {
                        document.querySelector(".swal-shortcut-group img").src =
                            ROOT_ICO_PATH + name;
                        document
                            .querySelector(".swal-shortcut-group img")
                            .setAttribute("data-path", ROOT_ICO_PATH + name);
                        setShowSelectShortcutItem(false, true);
                    };
                    document.querySelector(".select-image__container div").appendChild(div);
                });
                showButtonAdd();
                break;
            case "remove-video-upload-completed":
                break;
            case "user-path":
                user_path = event.data.data.path;
                showShortcut();
                break;
            case "confirm-quit-and-install":
                console.log("Show Modal");
                Swal.fire({
                    title: text.text_confirm_exit_and_install_the_application,
                    showCancelButton: true,
                    confirmButtonText: "Quit Application",
                }).then((result) => {
                    if (result.isConfirmed) {
                        electronAPI.confirmQuitAndInstall();
                    }
                });
                break;
            default:
                break;
        }
    }
});
const showButtonAdd = () => {
    let div = document.createElement("div");
    div.classList = "item";
    div.onclick = () => {
        div.remove();
        showButtonLoading();
        fetch(
            `https://wallpaper-and-skin-image-backend.vercel.app/images?limit=${SHORTCUT_API_LIMIT}&page=${SHORTCUT_API_PAGE}&sort=1`,
            {
                method: "GET",
                redirect: "follow",
            }
        )
            .then((response) => response.json())
            .then((result) => {
                showButtonLoading(false);
                result.data.data.forEach((img) => {
                    let div = document.createElement("div");
                    div.classList = "item";
                    div.innerHTML = `<img src="${img.url}"
                     alt="${img.url}"/>`;
                    div.onclick = (e) => {
                        document.querySelector(".swal-shortcut-group img").src = img.url;
                        document
                            .querySelector(".swal-shortcut-group img")
                            .setAttribute("data-path", img.url);
                        setShowSelectShortcutItem(false, true);
                    };
                    document.querySelector(".select-image__container div").appendChild(div);
                });
                if (SHORTCUT_API_LIMIT * SHORTCUT_API_PAGE < result.data.total) {
                    showButtonAdd();
                    SHORTCUT_API_PAGE++;
                }
            })
            .catch((error) => console.error(error));
    };
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>`;
    document.querySelector(".select-image__container div").appendChild(div);
};
const showButtonLoading = (state) => {
    if (state === false)
        return document.querySelector(".select-image__container div").lastElementChild.remove();
    let div = document.createElement("div");
    div.classList = "item";
    div.style.padding = "10px";
    div.innerHTML = `<span class="loader"></span>`;
    document.querySelector(".select-image__container div").appendChild(div);
};
