// tên hàm của 1 số setTime...

var closeBrightness,
    closeAudio,
    canPlayVideoBackground = true,
    temp = {};

var calendar = {
    today: new Date(),
    date: {
        number: new Date().getDate(),
    },
    month: {
        number: new Date().getMonth() + 1,
        text: getTextOfMonth(new Date().getMonth() + 1),
    },
    year: {
        number: new Date().getFullYear(),
    },
    setValue: function (day) {
        calendar.date = day.getDate();
        calendar.month.number = day.getMonth() + 1;
        calendar.month.text = getTextOfMonth(day.getMonth() + 1);
        calendar.year = day.getFullYear();
    },
};

var background = {
    type: 'auto',
    day: 6,
    night: 18,
};
var weather = localStorage.getItem('weather') ? JSON.parse(localStorage.getItem('weather')) : {};

var defaultData = {
    lat: '21.0278',
    lon: '105.8342',
    cityName: 'Thành phố Hà Nội',
};
window.onload = function () {
    // ? get dữ liệu
    getLocalData();
    //? set video nền
    setVideoBackground();
    //? set ngày cho lịch
    setDaysOfCalendar();
    // sự kiện cho body
    document.body.addEventListener('mouseleave', () => {
        closeExtensions();
    });
    document.body.addEventListener('keydown', (e) => {
        if (e.keyCode == 37 || e.keyCode == 40) document.getElementById('pre-month-btn').click();
        if (e.keyCode == 38 || e.keyCode == 39) document.getElementById('next-month-btn').click();
    });

    // thêm sk cho nút next tháng ở lich
    document.getElementById('next-month-btn').addEventListener('click', () => {
        var year = calendar.month == 12 ? calendar.year + 1 : calendar.year;
        var month = calendar.month.number;
        setDaysOfCalendar(new Date(year, month, 1));
    });
    // nút pre
    document.getElementById('pre-month-btn').addEventListener('click', () => {
        var year = calendar.month == 1 ? calendar.year - 1 : calendar.year;
        var month = calendar.month.number - 2;
        setDaysOfCalendar(new Date(year, month, 1));
    });
    // ấn vào lịch
    document.querySelector('.extensions .calendar').addEventListener('click', () => {
        if (document.querySelector('.extensions .calendar').classList.contains('min')) {
            setDaysOfCalendar();
            document.querySelector('.extensions .calendar').classList.add('max');
            document.querySelector('.extensions .calendar').classList.remove('min');
        }
    });
    document.querySelector('.extensions .element-click').addEventListener('click', () => {
        if (document.querySelector('.blur').style.display == 'none') blur(true);
    });
    //? ấn vào trời
    document.querySelectorAll('.extensions .sky').forEach((elmt) => {
        elmt.addEventListener('click', (event) => {
            if (elmt.classList.contains('min')) {
                elmt.classList.add('max');
                elmt.classList.remove('min');
            }
            document.querySelectorAll('.extensions .sky .content ul').forEach((element) => {
                let li = element.childNodes;
                li.forEach((elmt) => {
                    elmt.classList = 'li-class';
                });
                if (background.type == 'auto') li[1].className = 'active';
                if (background.type == 'day') li[3].className = 'active';
                if (background.type == 'night') li[5].className = 'active';
            });
        });
        elmt.addEventListener('mousedown', (event) => {
            if (elmt.classList.contains('min')) {
                elmt.classList.add('max');
                elmt.classList.remove('min');
            }
            document.querySelectorAll('.extensions .sky .content ul').forEach((element) => {
                if (!event.target.classList.contains('li-class')) {
                    element.style.top = event.clientY - 10 + 'px';
                    element.style.left = event.clientX - 10 + 'px';
                }
                let li = element.childNodes;
                li.forEach((elmt) => {
                    elmt.classList = 'li-class';
                });
                if (background.type == 'auto') li[1].className = 'active';
                if (background.type == 'day') li[3].className = 'active';
                if (background.type == 'night') li[5].className = 'active';
            });
        });
    });
    // ấn vào đèn
    document.querySelectorAll('.extensions .light').forEach((elmt) => {
        elmt.addEventListener('click', () => {
            if (
                !document
                    .querySelector('.extensions .change-brightness')
                    .classList.contains('active')
            ) {
                document.querySelector('.extensions .change-brightness').classList.add('active');
                document.querySelector('.extensions .change-audio').classList.remove('active');
                CloseBrightness();
            }
        });
    });
    // chỉ chuột vào đèn
    document.querySelector('.extensions .change-brightness').addEventListener('mouseenter', () => {
        clearInterval(closeBrightness);
    });
    document.querySelector('.extensions .change-brightness').addEventListener('mouseleave', () => {
        CloseBrightness();
    });

    // ấn vào tivi
    document.querySelectorAll('.extensions .tivi').forEach((elmt) => {
        elmt.addEventListener('click', () => {
            if (!document.querySelector('.extensions .change-audio').classList.contains('active')) {
                document.querySelector('.extensions .change-audio').classList.add('active');
                document.querySelector('.extensions .change-brightness').classList.remove('active');
                CloseAudio();
            }
        });
    });
    // chỉ chuột
    document.querySelector('.extensions .change-audio').addEventListener('mouseenter', () => {
        clearInterval(closeAudio);
    });
    document.querySelector('.extensions .change-audio').addEventListener('mouseleave', () => {
        CloseAudio();
    });
    // độ sáng màn hình
    document.getElementById('brightness').addEventListener('input', (event) => {
        let light = event.target.value;
        window.electronAPI.setBrightness(light / 100);
    });
    document.getElementById('audio').addEventListener('input', (event) => {
        let audio = event.target.value;
        window.electronAPI.setAudio(audio / 100);
    });
    // khóa màn hình
    document.body.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('video-bg'))
            window.electronAPI.openInCMD(
                'C:/Windows/System32/rundll32.exe user32.dll,LockWorkStation'
            );
    });
    // ấn vào chuông
    document.getElementById('audio-bell').addEventListener('click', () => {
        if (
            document.getElementById('audio-bell').classList.contains('muted') &&
            window.electronAPI.isMuted()
        ) {
            window.electronAPI.setMute(false);
            document.getElementById('audio-bell').classList.add('unmute');
            document.getElementById('audio-bell').classList.remove('muted');
        } else {
            window.electronAPI.setMute(true);
            document.getElementById('audio-bell').classList.remove('unmute');
            document.getElementById('audio-bell').classList.add('muted');
        }
    });
    // ấn vào laptop
    document.querySelector('.extensions .laptop').addEventListener('click', () => {
        window.electronAPI.openInCMD('C:/Windows/System32/SlideToShutDown.exe');
    });
    document.getElementById('audio').addEventListener('input', (event) => {
        let audio = event.target.value;
        window.electronAPI.setAudio(audio * 2);
    });
    // ấn vào cầu thang
    document.querySelector('.extensions .stair').addEventListener('click', (event) => {
        if (document.querySelector('.extensions .stair').classList.contains('min')) {
            document.querySelector('.extensions .stair').classList.add('max');
            document.querySelector('.extensions .stair').classList.remove('min');

            document.querySelectorAll('.extensions .stair .content ul').forEach((element) => {
                element.style.top = event.clientY - 20 + 'px';
                element.style.left = event.clientX - 20 + 'px';
                let li = element.childNodes;
            });
        }
    });

    let position = localStorage.getItem('position-extensions');
    if (position) {
        position = JSON.parse(position);
        position.forEach((elmt) => {
            let element = document.getElementById(elmt.id);
            element.style.top = elmt.top + 'px';
            element.style.left = elmt.left + 'px';
        });
    }
    getWeather();
    setWeatherInScreen();
    setTimeInScreen();
    setInterval(setTimeInScreen, 1000);
    setInterval(setVideoBackground, 1000);
    setInterval(setWeatherInScreen, 5 * 60 * 1000);
    dragElement('clock-mini');
    dragElement('weather');
    var videoPlay = true;
    setInterval(async () => {
        if (!window.electronAPI) return;
        var lock = await window.electronAPI.isLocked();
        if (lock == videoPlay) {
            videoPlay = !videoPlay;
        } else {
            if (lock) document.getElementById('video').pause();
            else if (document.getElementById('video').paused && canPlayVideoBackground)
                document.getElementById('video').play();
        }
    }, 1000);
    document.getElementById('weather').addEventListener('click', setWeatherInScreen);
    document.getElementById('weather').addEventListener('mousedown', (e) => {
        if (e.button == 2) changeGeo();
    });
    document.querySelector('.background').addEventListener('mousedown', (e) => {
        if (e.button == 2) {
            e.preventDefault();
            document.querySelector('.right-mouse-click').style.top = e.y - 5 + 'px';
            document.querySelector('.right-mouse-click').style.left = e.x - 5 + 'px';
            document.querySelector('.right-mouse-click').classList.add('active');
        }
    });
    document
        .querySelector('.right-mouse-click')
        .addEventListener('mouseleave', mouseleaveRightClickUL);
    let li = document.querySelectorAll('.right-mouse-click ul li');
    li[0].addEventListener('click', setStatusBackgroundPlay);
    li[1].addEventListener('click', () => {
        window.open('https://github.com/quangtrong1506/wallpaper-app/blob/main/README.md');
    });
    li[2].addEventListener('click', () => {
        window.electronAPI.openInCMD('C:/Windows/System32/rundll32.exe user32.dll,LockWorkStation');
    });
    li[3].addEventListener('click', () => {
        Swal.fire({
            title: 'Xác nhận đóng ứng dụng?',
            showCancelButton: true,
            confirmButtonText: 'Thoát',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                window.electronAPI.quitApp();
            }
        });
    });
    if (!localStorage.getItem('geo')) changeGeo();
};
function setTimeInScreen() {
    let date = new Date();
    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    document.querySelector('.extensions .time .count-time .hours').innerHTML = h;
    document.querySelector('.extensions .time .count-time .minutes').innerHTML = m;
    document.querySelector('.extensions .time .day').innerHTML = getTextOfDay(date.getDay());
    document.querySelector('.extensions .time .footer .date span').innerHTML = d + '/' + month;
    document.querySelector('.extensions .time .day').innerHTML = getTextOfDay(date.getDay());
}
function CloseBrightness() {
    closeBrightness = setTimeout(() => {
        if (document.querySelector('.extensions .change-brightness').classList.contains('active'))
            document.querySelector('.extensions .change-brightness').classList.remove('active');
    }, 3000);
}
function CloseAudio() {
    closeAudio = setTimeout(() => {
        if (document.querySelector('.extensions .change-audio').classList.contains('active'))
            document.querySelector('.extensions .change-audio').classList.remove('active');
    }, 3000);
}
function getLocalData() {
    if (localStorage.getItem('background'))
        background = JSON.parse(localStorage.getItem('background'));
}
function setVideoBackground() {
    let videoList = ['ngay.mp4', 'dem.mp4'];
    let date = new Date();
    let hour = date.getHours() + date.getMinutes() / 60;
    let video = document.getElementById('video');
    let src = video.src;
    if (background.type == 'auto') {
        if (hour >= background.day && hour < background.night) {
            src = './src/videos/' + videoList[0];
        } else src = './src/videos/' + videoList[1];
    } else if (background.type == 'day') {
        src = './src/videos/' + videoList[0];
    } else if (background.type == 'night') {
        src = './src/videos/' + videoList[1];
    }
    if (!video.src.match(src)) video.src = src;
    if (!canPlayVideoBackground) document.getElementById('video').pause();
}

function setDaysOfCalendar(day = new Date()) {
    calendar.setValue(day);
    document.getElementById('text-month').innerText = calendar.month.text;
    document.getElementById('text-year').innerText = calendar.year;
    let lastDayOfMont = new Date(calendar.year, calendar.month.number, 0);
    let firstDayOfMont = new Date(calendar.year, calendar.month.number - 1, 1);
    let skip = firstDayOfMont.getDay() == 0 ? 6 : firstDayOfMont.getDay() - 1;
    let datesTag = document.getElementById('dates');
    datesTag.innerHTML = '';
    while (skip--) {
        var li = document.createElement('li');
        li.className = 'skip';
        datesTag.appendChild(li);
    }
    let count = lastDayOfMont.getDate();
    for (let i = 0; i < count; i++) {
        var li = document.createElement('li');
        var dayTmp = new Date(calendar.year, calendar.month.number - 1, i + 1);
        if (
            calendar.today.getFullYear() == dayTmp.getFullYear() &&
            calendar.today.getMonth() == dayTmp.getMonth()
        ) {
            li.className = calendar.today.getDate() == dayTmp.getDate() ? 'today' : '';
        }
        li.innerHTML = `<span>${i + 1}</span>`;
        datesTag.appendChild(li);
    }
}

function closeExtensions() {
    blur(false);
    //? lịch
    document.querySelector('.extensions .calendar').classList.remove('max');
    document.querySelector('.extensions .calendar').classList.add('min');
}
function blur(bool) {
    document.querySelector('.blur').style.display = bool ? 'block' : 'none';
}

function onmouseleaveSky() {
    var lights = document.querySelectorAll('.extensions .sky');
    lights.forEach((elmt) => {
        elmt.classList.add('min');
        elmt.classList.remove('max');
    });
}
function onmouseleaveStair() {
    var lights = document.querySelectorAll('.extensions .stair');
    lights.forEach((elmt) => {
        elmt.classList.add('min');
        elmt.classList.remove('max');
    });
}

function setTypeBackground(type) {
    background.type = type;
    localStorage.setItem('background', JSON.stringify(background));
    setVideoBackground();
}

let success = function (battery) {
    if (battery) {
        function setStatus() {
            let batteryLevel = Math.round(battery.level * 100);
            document.querySelector('.extensions .time .battery .present').innerHTML =
                batteryLevel + '%';
            document.querySelector('.extensions .time .battery .battery-icon').innerHTML =
                getBatteryIcon(Math.floor((batteryLevel / 100) * 5));
        }
        setStatus();
        // Set events
        battery.addEventListener('levelchange', setStatus, false);
        battery.addEventListener('chargingchange', chargingChange, false);
        battery.addEventListener('chargingtimechange', chargingChange, false);
        battery.addEventListener('dischargingtimechange', chargingChange, false);
    } else {
        throw new Error('Battery API not supported on your device/computer');
    }
};
function chargingChange() {
    navigator.getBattery().then((value) => {
        var batteryCharging = value.charging;
        let batteryLevel = Math.round(value.level * 100);
        var batteryChargingTime =
            value.chargingTime == 'Infinity' ? 'Infinity' : parseInt(value.chargingTime / 60, 10);
        if (batteryLevel == 100 && batteryCharging)
            sendNotification(
                'Pin đầy',
                'Pin của bạn đã được sạc đầy vui lòng rút sạc để bảo vệ pin'
            );
        if (batteryChargingTime != 'Infinity' && batteryCharging && batteryChargingTime != 0)
            sendNotification(
                'Thời gian sạc',
                'Pin của bạn sẽ được sạc đầy sau ' + batteryChargingTime + ' phút'
            );
        if (batteryLevel <= 20 && !batteryCharging && !document.getElementById('video').paused)
            document.getElementById('video').pause();
        else if (
            batteryCharging &&
            document.getElementById('video').paused &&
            canPlayVideoBackground
        )
            document.getElementById('video').play();
    });
}
navigator
    .getBattery()
    .then(success)
    .catch((error) => console.log(error));

function sendNotification(title = 'Không có tiêu đề', body = 'Không có mô tả') {
    if (window.electronAPI) window.electronAPI.setTitle({ title: title, body: body });
}

function dragElement(id) {
    var element = document.getElementById(id);
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (element) element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let top = element.offsetTop - pos2 < 0 ? 0 : element.offsetTop - pos2;
        let left = element.offsetLeft - pos1 < 0 ? 0 : element.offsetLeft - pos1;
        var body = document.body;
        top =
            top > body.clientHeight - element.clientHeight
                ? body.clientHeight - element.clientHeight
                : top;
        left =
            left > body.clientWidth - element.clientWidth
                ? body.clientWidth - element.clientWidth
                : left;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    function closeDragElement() {
        let position = localStorage.getItem('position-extensions');
        if (position) position = JSON.parse(position);
        else
            position = [
                {
                    id: element.id,
                },
            ];

        for (let i = 0; i < position.length; i++) {
            const elmt = position[i];
            if (elmt.id == element.id) {
                elmt.top = element.offsetTop;
                elmt.left = element.offsetLeft;
                break;
            } else if (position.length - 1 == i) {
                position.push({
                    id: element.id,
                    top: element.offsetTop,
                    left: element.offsetLeft,
                });
            }
        }
        localStorage.setItem('position-extensions', JSON.stringify(position));

        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function setPosElement(id, top, left) {
    element = document.getElementById(id);
    top = top < 0 ? 0 : top;
    left = left < 0 ? 0 : left;
    element.style.top = top + 'px';
    element.style.left = left + 'px';
}

function getWeather(lat = defaultData.lat, lon = defaultData.lon) {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=vi&appid=3d4536c55fefa30aa5c6b8e247de03b3`,
        requestOptions
    )
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result);
            if (!result.code) {
                weather = result.current;
                let sunrise = new Date(weather.sunrise * 1000);
                let sunset = new Date(weather.sunset * 1000);
                background.day = (sunrise.getHours() + sunrise.getMinutes() / 60).toFixed(2);
                background.night = (sunset.getHours() + sunset.getMinutes() / 60).toFixed(2);
                localStorage.setItem('weather', JSON.stringify(weather));
                localStorage.setItem('background', JSON.stringify(background));
            }
        })
        .catch((error) => console.log('error', error));

    // fetch(
    //     `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=3d4536c55fefa30aa5c6b8e247de03b3`,
    //     requestOptions
    // )
    //     .then((response) => response.text())
    //     .then((result) => {
    //         result = JSON.parse(result);
    //         result = result[0];
    //         var city = {
    //             lat: result.lat,
    //             lon: result.lon,
    //             name: result.local_names.vi,
    //         };
    //         localStorage.setItem('city', JSON.stringify(city));
    //     })
    //     .catch((error) => console.log('error', error));
}

async function setWeatherInScreen() {
    if (localStorage.getItem('geo')) {
        let position = JSON.parse(localStorage.getItem('geo'));
        getWeather(position.lat, position.lon);
    } else getWeather();
    weather = JSON.parse(localStorage.getItem('weather'));
    document.getElementById('weather-icon').src =
        './src/images/weather/' + weather.weather[0].icon + '.png';
    let temperature = Math.floor(weather.temp - 273.15);
    let description = weather.weather[0].description;
    if (description == 'mây cụm') description = 'Nhiều nơi có mây';
    description =
        description.slice(0, 1).toLocaleUpperCase() + description.slice(1, description.length);
    document.getElementById('temperature').innerHTML = temperature + '°';
    document.getElementById('description').innerHTML = description;
    document.getElementById('wind').innerHTML = weather.wind_speed + 'm/s';
    document.getElementById('humidity').innerHTML = weather.humidity + '%';
    document.getElementById('uvi').innerHTML = weather.uvi;
}
function mouseleaveRightClickUL() {
    document.querySelector('.right-mouse-click').classList.remove('active');
}

function setStatusBackgroundPlay() {
    let li = document.querySelectorAll('.right-mouse-click ul li');
    li[0].innerHTML = canPlayVideoBackground ? 'Chạy video màn hình' : 'Dừng video màn hình';
    canPlayVideoBackground = !canPlayVideoBackground;
    if (!canPlayVideoBackground) document.getElementById('video').pause();
    else document.getElementById('video').play();
}

function checkFirstLogin() {
    if (!localStorage.getItem('geo')) {
    }
}

function changeGeo() {
    let lat = temp.lat || defaultData.lat;
    let lon = temp.lon || defaultData.lon;
    let name = temp.cityName;
    let oldName = 'Thành phố Hà Nội';
    if (localStorage.getItem('geo')) {
        let tmp = JSON.parse(localStorage.getItem('geo'));
        oldName = tmp.cityName;
    }
    let newCityName = name ? `Vị trí mới: <span class="city-name-overview">${name}</span>` : '';
    Swal.fire({
        title: 'Thay đổi vị trí của bạn',
        html: `<div class="change-geo">
                    <div class="header">
                        <h4>Nếu bạn không nhập thông tin hệ thống sẽ lấy vị trí mặc định </h4>
                        <h4>Vị trí hiện tại: <span class="city-name-old">${oldName}</span></h4>
                        <h4>${newCityName}</h4>
                    </div>
                    <div class="geo-input">
                        <div>
                            <label for="geo-lat">Vĩ độ (latitude)</label>
                            <input id="geo-lat" type="text" placeholder="Mặc định: ${defaultData.lat}" value="${lat}">
                        </div>
                        <div>
                            <label for="geo-lon">Kinh độ (longitude)</label>
                            <input id="geo-lon" type="text" placeholder="Mặc định: ${defaultData.lon}" value="${lon}">
                        </div>
                    </div>
                </div>
                <i style="color: red; ">*</i><i style="font-size: 14px;"> Ấn lưu để không hiện lại thông báo này</i>

                `,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cập nhật',
        denyButtonText: `Check`,
        CancelButtonText: `Hủy`,
        customClass: {
            cancelButton: 'cancel--btn',
            confirmButton: 'confirm--btn',
            denyButton: 'deny--btn',
        },
    }).then((result) => {
        let lat = document.getElementById('geo-lat').value || defaultData.lat;
        let lon = document.getElementById('geo-lon').value || defaultData.lon;
        temp.lat = lat;
        temp.lon = lon;
        if (result.isConfirmed) {
            let c = localStorage.getItem('geo') ? name : defaultData.cityName;
            localStorage.setItem(
                'geo',
                JSON.stringify({
                    cityName: name || c,
                    lat: lat,
                    lon: lon,
                })
            );
            Swal.fire('Thay đổi vị trí nhận thời tiết thành công!', temp.cityName, 'success');
            temp = {};
        } else if (result.isDenied) {
            let requestOptions = {
                method: 'GET',
                redirect: 'follow',
            };
            fetch(
                `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=3d4536c55fefa30aa5c6b8e247de03b3`,
                requestOptions
            )
                .then((response) => response.text())
                .then((result) => {
                    result = JSON.parse(result);
                    console.log(result);
                    if (!result.message) {
                        temp.cityName = result[0].local_names.vi || result[0].name;
                        Swal.fire(
                            'Vị trí bạn nhập là',
                            temp.cityName + ', ' + result[0].country,
                            'info'
                        ).then(changeGeo);
                    } else Swal.fire('ERROR', result.message, 'error').then(changeGeo);
                })
                .catch(() =>
                    Swal.fire(
                        'Lỗi lấy thông tin vị trí',
                        'vui lòng kiểm tra lại đường truyền internet của bạn',
                        'error'
                    ).then(changeGeo)
                );
        }
    });
}
