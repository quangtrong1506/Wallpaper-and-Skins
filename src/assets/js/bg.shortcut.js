const ROOT_PATH_IMAGE_SHORTCUT = isDev
    ? "../../assets/images/shortcut/"
    : "../../../../images/shortcut/";
const SHORTCUT_SIZE = [
    {
        size: "sm",
        class: "text_sm",
    },
    {
        size: "md",
        class: "text_md",
    },
    {
        size: "lg",
        class: "text_lg",
    },
    {
        size: "xl",
        class: "text_xl",
    },
    {
        size: "xxl",
        class: "text_xxl",
    },
];
const SHORTCUTS = {
    size: "sm",
    isAutoSort: true,
    items: [
        {
            id: null,
            path: null,
            iconId: null,
            title: null,
            isHidden: false,
            x: 0,
            y: 0,
        },
    ],
};
//? ICON
//Todo: Drag
//Todo: Kéo Shortcut
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
        handleOnmouseleaveOptionShortcut(sc.id);
        saveShortcut();
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
};
//Todo: Hiện tất cả shortcut
const showShortcut = () => {
    if (!user_path) return;
    document.getElementById("list-shortcut").innerHTML = "";
    SHORTCUTS.items.forEach((sc) => {
        let elmnt = document.createElement("div");
        elmnt.id = sc.id;
        elmnt.className = "app-icon__item " + SHORTCUTS.size;
        elmnt.draggable = true;
        elmnt.style.left =
            (sc.x > document.body.clientWidth ? document.body.clientWidth - 75 : sc.x) + "px";
        elmnt.style.top = (sc.y > screen.height ? screen.height - 105 : sc.y) + "px";
        if (sc.isHidden) elmnt.style.display = "none";
        elmnt.innerHTML = `
                    <div style="position:relative" ondblclick="openAppByShortcut('${
                        sc.path
                    }')" onmousedown="mousedownInIcon(event,'${sc.id}')">
                        <div class="icon" >
                            <img src="${
                                user_path.replaceAll("\\", "/") +
                                "/assets/images/shortcut/" +
                                sc.iconId +
                                ".png"
                            }" alt="..." onerror="handleImageError(event)" />
                        </div>
                        <div class="title">${sc.title}</div>
                        <div class="options z-index-1000 options-${
                            sc.id
                        }" onmouseleave="handleOnmouseleaveOptionShortcut('${sc.id}')">
                            <ul>
                                <li onclick="openAppByShortcut('${sc.path}')">Mở</li>
                                <li onclick="showEditShortcutItem('${sc.id}');">Chỉnh sửa</li>
                                <li onclick="deleteShortcut('${sc.id}')">Xoá</li>
                            </ul>
                    </div>
                    </div>`;
        document.getElementById("list-shortcut").appendChild(elmnt);
        dragElement(elmnt);
    });
};
//Todo: Config lại đường dẫn ứng dụng
const handleInputPath = (event) => {
    event.target.value = event.target.value
        .trim()
        .replaceAll("//", "/")
        .replaceAll("\\\\", "/")
        .replaceAll("\\", "/")
        .replaceAll(/\"/g, "")
        .replaceAll(/\'/g, "");
};
//Todo: Thêm mới hoặc chỉnh sửa shortcut
const showEditShortcutItem = (id) => {
    showMenu(false);
    let item = SHORTCUTS.items.find((item) => item.id === id);
    Swal.fire({
        title: `${item ? text.text_edit : text.text_add_new} Shortcut`,
        html: `<div class="swal-shortcut-group">
                <label>${text.text_name}</label>
                <input id="swal-input-name" type="text"
                 value="${item?.title || ""}" 
                 placeholder="${text.text_title_placeholder}">
            </div>
            <div class="swal-shortcut-group">
                <label>${text.text_path}</label>
                <input id="swal-input-path" type="text"
                 value="${item?.path || ""}" 
                 placeholder="${text.text_path_placeholder}" 
                 oninput="handleInputPath(event)">
            </div>
            <div class="swal-shortcut-group">
                <label class="icon-label">Icon</label>
                <img id="shortcut-icon-${item?.id || "new"}" 
                 src="${
                     item ? ROOT_PATH_IMAGE_SHORTCUT + item.iconId + ".png" : DEFAULT_IMAGE_PATH
                 }" 
                 data-path="${
                     item ? ROOT_PATH_IMAGE_SHORTCUT + item.iconId + ".png" : DEFAULT_IMAGE_PATH
                 }"
                 />
                <div>
                    <label for="input-change-shortcut-icon" class="change-icon">${
                        text.text_upload
                    }</label>
                    <label class="select-icon" onclick="setShowSelectShortcutItem()">${
                        text.text_select
                    }</label>
                </div>
                <input id="input-change-shortcut-icon" type="file" accept="image/*"
                 style="display:none" onchange="handleChangeShortcutIcon(this)" >
            </div>
        `,
        preConfirm: () => {
            if (!document.getElementById("swal-input-name").value)
                return Swal.showValidationMessage(text.text_your_application_name_is_required);
            if (!document.getElementById("swal-input-path").value)
                return Swal.showValidationMessage(text.your_application_path_is_required);
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
        allowOutsideClick: false,
        confirmButtonText: text.text_save,
        cancelButtonText: text.text_cancel,
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        let newIconId = customId();
        let id = item?.id || newIconId;
        if (result.isConfirmed == true) {
            if (!item)
                SHORTCUTS.items.push({
                    id,
                    iconId: newIconId,
                    path: result.value[1],
                    title: result.value[0],
                    isHidden: false,
                    x: 500,
                    y: 300,
                });
            else {
                electronAPI.removeImageUpload(item.iconId);
                item = {
                    ...item,
                    iconId: newIconId,
                    path: result.value[1],
                    title: result.value[0],
                };

                let index = SHORTCUTS.items.findIndex((item) => item.id === id);
                SHORTCUTS.items[index] = item;
            }
            saveShortcut();
            setTimeout(() => {
                if (SHORTCUTS.isAutoSort) sortShortcut();
                else showShortcut();
            }, 500);

            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL("image/png");
                dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                Electron_sendData({
                    type: "upload-image",
                    data: {
                        path: dataURL,
                        type: "base64",
                        name: newIconId,
                    },
                    description: "Upload image Shortcut",
                });
            };
            img.src = result.value[2];
        }
    });
};
//Todo: sự kiện khi upload image(icon)
const handleChangeShortcutIcon = (event) => {
    let file = event.files[0];
    document.querySelector(".swal-shortcut-group img").src = URL.createObjectURL(file);
    document.querySelector(".swal-shortcut-group img").setAttribute("data-path", file.path);
};
//Todo: click chuột (ấn chuột phải để hiện menu)
const mousedownInIcon = (event, id) => {
    event.preventDefault();
    if (event.button == 2) {
        SHORTCUTS.items.forEach((item) => handleOnmouseleaveOptionShortcut(item.id));
        document.querySelector(".app-icon .options-" + id).classList.contains("active")
            ? {}
            : document.querySelector(".app-icon .options-" + id).classList.add("active");
    }
};
//Todo: ẩn menu của shortcut khi chuột rời khỏi
const handleOnmouseleaveOptionShortcut = (id) => {
    document.querySelector(".app-icon .options-" + id)?.classList.remove("active");
};
//Todo: Lưu thông tin của tất cả shortcut vào local storage
const saveShortcut = () => {
    localStorage.setItem("shortcuts", JSON.stringify(SHORTCUTS));
};
//Todo: Mở ứng dụng
const openAppByShortcut = (path) => {
    electronAPI.openAppByShortcut(path);
};

//Todo: Xoá 1 shortcut
const deleteShortcut = (id) => {
    Swal.fire({
        title: "Do you want to delete this shortcut?",
        showCancelButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `Don't delete`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            // Swal.fire("Saved!", "", "success");
            let iID = SHORTCUTS.items.find((item) => item.id == id).iconId || -1;
            let item = SHORTCUTS.items.splice(
                SHORTCUTS.items.findIndex((item) => item.id == id),
                1
            );
            electronAPI.removeImageUpload(iID);
            saveShortcut();
            showShortcut();
        }
    });
};

//Todo: Menu size của shortcuts
const showSelectSizeShortcut = () => {
    document.querySelector(".menu-shortcut-size").innerHTML = "";
    SHORTCUT_SIZE.forEach((size) => {
        let element = document.createElement("div");
        element.className = "menu__item";
        element.innerHTML = `
            <label class="${size.class}">${text[size.class]}</label>
            <span class="${SHORTCUTS.size === size.size ? "checked" : ""} right-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                    />
                </svg>
            </span>`;
        element.addEventListener("click", () => {
            setShortcutSize(size.size);
        });
        document.querySelector(".menu-shortcut-size").appendChild(element);
    });
    let sortElement = document.createElement("div");
    sortElement.className = "menu__item menu__item-sort-f";
    sortElement.innerHTML = `
        <label class="${1}">${text.text_auto_sort}</label>
        <span class="${SHORTCUTS.isAutoSort ? "checked" : ""} right-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                />
            </svg>
        </span>`;
    sortElement.addEventListener("click", () => {
        setAutoSort(!SHORTCUTS.isAutoSort);
    });
    document.querySelector(".menu-shortcut-size").appendChild(sortElement);
};

//Todo: set kích thước của shortcut
const setShortcutSize = (size) => {
    localStorage.setItem("shortcut_size", size);
    SHORTCUTS.size = size;
    saveShortcut();
    showSelectSizeShortcut();
    if (SHORTCUTS.isAutoSort) sortShortcut();
};
//Todo: Hiện menu chỉnh sửa size shortcut
const showMenuShortcutSize = (state) => {
    if (state === true || state === undefined) {
        if (!document.querySelector(".menu-shortcut-size").classList.contains("active")) {
            document.querySelector(".menu-shortcut-size").classList.add("active");
            showMenuLanguage(false);
        }
    } else document.querySelector(".menu-shortcut-size").classList.remove("active");
};
//Todo: đóng tất cả menu bậc 2
const closeAllMenuLevel2 = () => {
    showMenuLanguage(false);
    showMenuShortcutSize(false);
};
const setShowSelectShortcutItem = (state, event) => {
    if (
        (state === undefined || state === true) &&
        !document.querySelector(".select-image").classList.contains("active")
    )
        document.querySelector(".select-image").classList.add("active");
    else if (event === true || event?.target.classList.contains("select-image"))
        document.querySelector(".select-image").classList.remove("active");
};

// Sắp xếp
// 75 x 95
// 100 x 120
// 125 x 150
// 150 x 170
// 175 x 200
const sortShortcut = () => {
    const sizes = {
        sm: {
            w: 75,
            h: 95,
        },
        md: {
            w: 100,
            h: 120,
        },
        lg: {
            w: 125,
            h: 150,
        },
        xl: {
            w: 150,
            h: 170,
        },
        xxl: {
            w: 175,
            h: 200,
        },
    };
    const screenHeight = document.body.clientHeight;
    const screenWidth = screen.width;
    const size = SHORTCUTS.size;
    const itemSize = sizes[size];
    SHORTCUTS.items.sort((a, b) => a.title.localeCompare(b.title));
    let row = 1;
    let col = 1;
    const space = 10;
    for (let i = 0; i < SHORTCUTS.items.length; i++) {
        const element = SHORTCUTS.items[i];
        let x = (col - 1) * itemSize.w + (col - 1) * space;
        let y = (row - 1) * itemSize.h + (row - 1) * space;
        if (y + itemSize.h > screenHeight) {
            col++;
            row = 1;
            x = (col - 1) * itemSize.w + (col - 1) * space;
            y = (row - 1) * itemSize.h + (row - 1) * space;
        }
        element.x = x;
        element.y = y;
        row++;
    }
    saveShortcut();
    showShortcut();
};
const setAutoSort = (state) => {
    SHORTCUTS.isAutoSort = state;
    saveShortcut();
    showSelectSizeShortcut();
    if (state === true) sortShortcut();
    // showMenu(false);
};
