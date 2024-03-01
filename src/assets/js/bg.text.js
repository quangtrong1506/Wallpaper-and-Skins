const listOfLanguages = [
    {
        name: 'Tiếng Việt',
        code: 'vi-VN',
    },
    {
        name: 'English',
        code: 'en-US',
    },
];

const vi = {
    menu: {
        video: {
            play: 'Phát video',
            pause: 'Tạm dừng video',
            changeVideo: 'Thay đổi video',
            uploadVideo: 'Upload video',
        },
    },
    language: {
        text: 'Ngôn ngữ',
        vi: 'Tiếng Việt',
        en: 'English',
    },
    default: 'Mặc định',
    reset: 'Xoá cài đặt',
    save: 'Lưu cài đặt',
    confirmReload: 'Thành công! bạn có muốn tải lại giao diện ngay bây giờ không',
    openMainSetting: 'Mở cài đặt',
    exit: 'Thoát',
    uploadingVideo: 'Đang tải video lên vui lòng đợi',
    cancel: 'Huỷ',
    background: 'Chạy dưới nền',
    MessageCompleteUploadVideo: 'Hình nền sẽ được thay đổi sau khi tải lên hoàn tất',
    MessageUploadVideoCompleted: 'Tải lên video hoàn tất',
    videoBackgroundError: 'Đã mất file video tải lên, Hệ thống sẽ dùng video gốc',
    confirm: 'Xác nhận',
    setToDefault: 'Bạn muốn cài lại mặc định',
    success: 'Thành công',
};
const en = {
    menu: {
        video: {
            play: 'Play video',
            pause: 'Pause video',
            changeVideo: 'Change video',
            uploadVideo: 'Upload video',
        },
    },
    language: {
        text: 'Language',
        vi: 'Tiếng Việt',
        en: 'English',
    },
    default: 'Default',
    reset: 'Reset',
    save: 'Save',
    confirmReload: 'Success! Do you want to reload the interface?',
    openMainSetting: 'Open settings',
    exit: 'Exit',
    uploadingVideo: 'Please wait... Video is being uploaded',
    cancel: 'Cancel',
    background: 'Runs in the background',
    MessageCompleteUploadVideo: 'The background image will be changed once the upload is complete',
    MessageUploadVideoCompleted: 'Upload video completed!',
    videoBackgroundError:
        'The uploaded video file has been lost. The system will use the original video',
    confirm: 'Confirm',
    setToDefault: 'You want to reset to default',
    success: 'Success',
};
let text = vi;
const setMainLanguage = () => {
    if (localStorage.getItem('language')) {
        let language = localStorage.getItem('language');
        if (language !== 'vi-VN') {
            text = en;
            localStorage.setItem('language', 'en-US');
        } else text = vi;
    } else if (navigator.language !== 'vi-VN') {
        text = en;
        localStorage.setItem('language', 'en-US');
    } else {
        localStorage.setItem('language', 'vi-VN');
        text = vi;
    }
};
