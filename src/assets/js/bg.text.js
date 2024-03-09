const listOfLanguages = [
    {
        name: "Tiếng Việt",
        code: "vi-VN",
    },
    {
        name: "English",
        code: "en-US",
    },
];
const vi = {
    text_menu_video_play: "Phát video",
    text_menu_video_pause: "Tạm dừng video",
    text_menu_video_change_video: "Thay đổi video",
    text_menu_video_upload_video: "Tải video lên",
    text_language: "Ngôn ngữ",
    text_vi: "Tiếng Việt",
    text_en: "English",
    text_default: "Mặc định",
    text_reset: "Reset về mặc định",
    text_save: "Lưu",
    text_confirm_reload: "Thành công! bạn có muốn tải lại giao diện ngay bây giờ không",
    text_open_main_setting: "Mở cài đặt",
    text_exit: "Thoát",
    text_uploading_video: "Đang tải video lên vui lòng đợi",
    text_cancel: "Huỷ",
    text_background: "Chạy dưới nền",
    text_message_complete_upload_video: "Hình nền sẽ được thay đổi sau khi tải lên hoàn tất",
    text_message_upload_video_completed: "Tải lên video hoàn tất",
    text_video_background_error: "Đã mất file video tải lên, Hệ thống sẽ dùng video gốc",
    text_confirm: "Xác nhận",
    text_set_to_default: "Bạn muốn cài lại mặc định",
    text_success: "Thành công",
    text_open: "Mở",
    text_delete: "Xoá",
    text_edit: "Chỉnh sửa",
    text_name: "Tên",
    text_shortcuts: "Lối tắt",
    text_shortcut_view: "Xem",
    text_create_shortcut: "Tạo lối tắt",
    text_change: "Thay đổi",
    text_title_shortcut: "Tên ứng dụng",
    text_path: "Đường dẫn",
    text_title_placeholder: "Tên ứng dụng của bạn",
    text_path_placeholder: "Đường dẫn đến ứng dụng của bạn (.exe)",
    text_add_new: "Thêm mới",
    text_your_application_name_is_required: "Tên ứng dụng của bạn là bắt buộc",
    your_application_path_is_required: "Đường dẫn ứng dụng của bạn là bắt buộc",
    text_sm: "Nhỏ",
    text_md: "Vừa",
    text_lg: "Lớn",
    text_xl: "Lớn vừa",
    text_xxl: "Lớn cực đại",
    text_upload: "Tải lên",
    text_select: "Chọn",
};
const en = {
    text_menu_video_play: "Play video",
    text_menu_video_pause: "Pause video",
    text_menu_video_change_video: "Change video",
    text_menu_video_upload_video: "Upload video",
    text_language: "Language",
    text_vi: "Tiếng Việt",
    text_en: "English",
    text_default: "Tefault",
    text_reset: "Reset to default",
    text_save: "Save",
    text_confirm_reload: "TWork! Do you want to reload the interface now",
    text_open_main_setting: "Open settings",
    text_exit: "Exit",
    text_uploading_video: "Uploading video, please wait",
    text_cancel: "Cancel",
    text_background: "Runs in the background",
    text_message_complete_upload_video: "The wallpaper will be changed once the upload is complete",
    text_message_upload_video_completed: "Video upload completed",
    text_video_background_error:
        "If the uploaded video file has been lost, the original video will be used",
    text_confirm: "Confirm",
    text_set_to_default: "You want to reset the defaults",
    text_success: "Success",
    text_open: "Open",
    text_delete: "Delete",
    text_edit: "Edit",
    text_name: "Name",
    text_shortcut_view: "View",
    text_shortcuts: "Shortcuts",
    text_create_shortcut: "Create shortcuts",
    text_change: "Change",
    text_title_shortcut: "App Name",
    text_path: "Path",
    text_title_placeholder: "Your app's name",
    text_path_placeholder: "Path to your application (.exe)",
    text_add_new: "Add new",
    text_your_application_name_is_required: "Your app name is required",
    your_application_path_is_required: "Your app path is required",
    text_sm: "Small",
    text_md: "Medium",
    text_lg: "Large",
    text_xl: "Extra Large",
    text_xxl: "Extra Extra Large",
    text_upload: "Upload",
    text_select: "Select",
};
let text = vi;
const setMainLanguage = () => {
    if (localStorage.getItem("language")) {
        let language = localStorage.getItem("language");
        if (language !== "vi-VN") {
            text = en;
            localStorage.setItem("language", "en-US");
        } else text = vi;
    } else if (navigator.language !== "vi-VN") {
        text = en;
        localStorage.setItem("language", "en-US");
    } else {
        localStorage.setItem("language", "vi-VN");
        text = vi;
    }
};
const setTextLabel = () => {
    for (let key in text) {
        document.querySelectorAll("." + key).forEach((element) => {
            element.innerHTML = text[key];
        });
    }
    bgState.isPlay
        ? (document.getElementById("text-video-state").innerText = text.text_menu_video_pause)
        : (document.getElementById("text-video-state").innerText = text.text_menu_video_play);
};
