function getTextOfMonth(month) {
    if (month == 1) return 'Tháng Một';
    if (month == 2) return 'Tháng Hai';
    if (month == 3) return 'Tháng Ba';
    if (month == 4) return 'Tháng Tư';
    if (month == 5) return 'Tháng Năm';
    if (month == 6) return 'Tháng Sáu';
    if (month == 7) return 'Tháng Bảy';
    if (month == 8) return 'Tháng Tám';
    if (month == 9) return 'Tháng Chín';
    if (month == 10) return 'Tháng Mười';
    if (month == 11) return 'Tháng Mười Một';
    if (month == 12) return 'Tháng Mười Hai';
    else return 'Lỗi';
}

function getTextOfDay(day) {
    if (day == 1) return 'Thứ hai';
    if (day == 2) return 'Thứ ba';
    if (day == 3) return 'Thứ tư';
    if (day == 4) return 'Thứ năm';
    if (day == 5) return 'Thứ sáu';
    if (day == 6) return 'Thứ bảy';
    if (day == 0) return 'Chủ nhật';
    else return 'Lỗi';
}
function getBatteryIcon(index) {
    if (index == 0) return '<i class="fa-solid fa-battery-empty"></i>';
    if (index == 1) return '<i class="fa-solid fa-battery-quarter"></i>';
    if (index == 2) return '<i class="fa-solid fa-battery-half"></i>';
    if (index == 3) return '<i class="fa-solid fa-battery-three-quarters"></i>';
    if (index == 4) return '<i class="fa-solid fa-battery-full"></i>';
    if (index == 5) return '<i class="fa-solid fa-battery-full"></i>';
}
