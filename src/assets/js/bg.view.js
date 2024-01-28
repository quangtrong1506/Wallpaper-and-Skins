let bgState = {
    isPlay: true,
    videoUpload: null,
    videoId: 0,
};
const isDev = localStorage.getItem('isDev');
if (isDev) {
    console.log('Hi! Developer');
}
window.onload = () => {
    setMainLanguage();
    //Add event
    document.getElementById('video-background').addEventListener('click', () => {
        showMenu(false);
    });
    //Load state
    if (localStorage.getItem('bg-state')) {
        bgState = JSON.parse(localStorage.getItem('bg-state'));
    } else {
    }

    //Set text menu
    console.log(bgState);
    setStateVideo();
    setText();
    setViewSelectLanguage();
};
//? Mouse Events
const mouseLeaveEvent = () => {
    showMenu(false);
};
const mousedownEvent = (event) => {
    event.preventDefault();
    let state = {
        button: event.button,
        x: event.x,
        y: event.y,
    };

    if (state.button == 2) showMenu(true, state.x, state.y);
};
window.addEventListener('contextmenu', (e) => e.preventDefault());
//- End Mouse events
const showMenu = (state, x, y) => {
    let bodyState = {
        w: document.body.clientWidth,
        h: document.body.clientHeight,
    };
    let menuState = {
        w: document.querySelector('.menu').clientWidth,
        h: document.querySelector('.menu').clientHeight,
    };
    let menu = document.querySelector('.menu');
    if (state === true) {
        if (!menu.classList.contains('active')) menu.classList.add('active');
        if (x + menuState.w > bodyState.w) menu.style.left = bodyState.w - menuState.w + 'px';
        else menu.style.left = x + 'px';
        if (y + menuState.h > bodyState.h) menu.style.top = bodyState.h - menuState.h + 'px';
        else menu.style.top = y + 'px';
    } else {
        if (menu.classList.contains('active')) menu.classList.remove('active');
    }
};
//? State
const saveBgSate = () => {
    localStorage.setItem('bg-state', JSON.stringify(bgState));
};
//? Video
const setStateVideo = () => {
    if (bgState.isPlay) document.getElementById('video-background').play();
    else document.getElementById('video-background').pause();
    bgState.isPlay
        ? (document.getElementById('text-video-state').innerText = text.menu.video.pause)
        : (document.getElementById('text-video-state').innerText = text.menu.video.play);
};

const changeStateVideo = () => {
    if (bgState.isPlay) bgState.isPlay = false;
    else bgState.isPlay = true;
    setStateVideo();
};

const showMenuChangeVideo = (state) => {
    if (state === true || state === undefined) {
        if (!document.querySelector('.change-video').classList.contains('active'))
            document.querySelector('.change-video').classList.add('active');
    } else document.querySelector('.change-video').classList.remove('active');
    document.getElementById('video-demo-upload').src = '../../assets/videos/bg-default.mp4';
};
// Upload
const uploadVideoChangeEvent = (event) => {
    document.querySelector('.video-name').innerHTML = event.files[0].name;
    let src = URL.createObjectURL(event.files[0]);
    bgState.videoUpload = event.files[0];
    document.getElementById('video-demo-upload').src = src;
    // if (
    //     !document
    //         .querySelector('.change-video .change-video__container-video-upload .video-demo')
    //         .classList.contains('active')
    // )
    //     document
    //         .querySelector('.change-video .change-video__container-video-upload .video-demo')
    //         .classList.add('active');
};
const saveNewVideo = () => {
    if (bgState.videoUpload == null) {
        showMenuChangeVideo(false);
    } else {
        Swal.fire({
            title: 'Uploading video',
            html:
                text.uploadingVideo +
                `<br>
                <span class="loader-custom"></span>
            `,
            showDenyButton: true,
            confirmButtonText: text.background,
            // denyButtonText: text.cancel,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: text.MessageCompleteUploadVideo,
                    icon: 'info',
                });
            }
        });
        Electron_sendData({
            type: 'upload',
            data: {
                path: bgState.videoUpload.path,
                type: bgState.videoUpload.type,
            },
            description: 'Tải video mới lên',
        });
    }
};
//-End Video

//?Language
//Set Text Language
const setText = () => {
    document.querySelectorAll('.text-change-video').forEach((element) => {
        element.innerHTML = text.menu.video.changeVideo;
    });
    document.querySelectorAll('.text-save').forEach((element) => {
        element.innerHTML = text.save;
    });
    document.querySelectorAll('.text-reset').forEach((element) => {
        element.innerHTML = text.reset;
    });
    document.querySelectorAll('.text-upload').forEach((element) => {
        element.innerHTML = text.menu.video.uploadVideo;
    });
    document.querySelectorAll('.text-select-language').forEach((element) => {
        element.innerHTML = text.language.text;
    });
    document.querySelectorAll('.text-open-settings').forEach((element) => {
        element.innerHTML = text.openMainSetting;
    });
    document.querySelectorAll('.text-exit').forEach((element) => {
        element.innerHTML = text.exit;
    });
    bgState.isPlay
        ? (document.getElementById('text-video-state').innerText = text.menu.video.pause)
        : (document.getElementById('text-video-state').innerText = text.menu.video.play);
};
const setViewSelectLanguage = () => {
    document.querySelector('.menu-language').innerHTML = '';
    listOfLanguages.forEach((lang) => {
        let element = document.createElement('div');
        element.className = 'menu__item';
        element.innerHTML = `
            <label>${lang.name}</label>
            <span class="${
                localStorage.getItem('language') === lang.code ? 'checked' : ''
            } right-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                    />
                </svg>
            </span>`;
        element.addEventListener('click', () => {
            setLanguage(lang.code);
        });
        document.querySelector('.menu-language').appendChild(element);
    });
};
const setLanguage = (code) => {
    localStorage.setItem('language', code);
    setMainLanguage();
    setViewSelectLanguage();
    setText();
};
const showMenuLanguage = (state) => {
    if (state === true || state === undefined) {
        if (!document.querySelector('.menu-language').classList.contains('active'))
            document.querySelector('.menu-language').classList.add('active');
    } else document.querySelector('.menu-language').classList.remove('active');
};
//
//ElectronJS
const Electron_sendData = (
    data = {
        type: -1,
        data: null,
        description: '',
        other: null,
    }
) => {
    window.electronAPI?.viewToBackGround(data);
};
// Get messages
window.addEventListener('message', (event) => {
    if (event.source === window) {
        console.log(event.data);
        if (event.data?.type == 'upload-video') {
            if (event.data?.status === 200) {
                Swal.fire({
                    text: text.MessageUploadVideoCompleted,
                    icon: 'info',
                });
                showMenuChangeVideo(false);
                document.querySelector('.video-name').innerHTML = '';
                bgState.videoUpload = null;
                bgState.videoId = 1;
                saveBgSate();
            } else
                Swal.fire({
                    text: 'Error upload video',
                    icon: 'error',
                });
        }
    }
});
