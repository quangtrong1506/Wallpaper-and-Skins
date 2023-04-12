// tên hàm của 1 số setTime...
var closeBrightness, closeAudio;

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
    document.body.addEventListener('dblclick', () => {
        window.electronAPI.openInCMD('C:/Windows/System32/rundll32.exe user32.dll,LockWorkStation');
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
    // set thời gian cho đồng hồ treo tường
    setInterval(setTimeInScreen, 1000);

    let position = localStorage.getItem('position-extensions');
    if (position) {
        position = JSON.parse(position);
        position.forEach((elmt) => {
            let element = document.getElementById(elmt.id);
            element.style.top = elmt.top + 'px';
            element.style.left = elmt.left + 'px';
        });
    }
    setWeatherInScreen();
    setTimeInScreen();
    setInterval(setWeatherInScreen, 5 * 60 * 1000);
    dragElement('clock-mini');
    dragElement('weather');
    setInterval(async () => {
        let brightnessLevel = await window.electronAPI.getBrightness();
        document.getElementById('brightness').value = brightnessLevel * 100;
        let mute = await window.electronAPI.isMuted();
        let audio = await window.electronAPI.getAudio();
        if (mute) {
            document.getElementById('audio-bell').classList.remove('unmute');
            document.getElementById('audio-bell').classList.add('muted');
        } else {
            document.getElementById('audio-bell').classList.add('unmute');
            document.getElementById('audio-bell').classList.remove('muted');
        }
        document.getElementById('audio').value = audio / 2;
    }, 1000);

    var videoPlay = true;
    setInterval(async () => {
        var lock = await window.electronAPI.isLocked();
        if (lock == videoPlay) {
            videoPlay = !videoPlay;
        } else {
            if (lock) document.getElementById('video').pause();
            else if (document.getElementById('video').paused)
                document.getElementById('video').play();
        }
    }, 1000);
};
function setTimeInScreen() {
    var date = new Date();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
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
    }, 5000);
}
function CloseAudio() {
    closeAudio = setTimeout(() => {
        if (document.querySelector('.extensions .change-audio').classList.contains('active'))
            document.querySelector('.extensions .change-audio').classList.remove('active');
    }, 5000);
}
function getLocalData() {
    if (localStorage.getItem('background'))
        background = JSON.parse(localStorage.getItem('background'));
}
function setVideoBackground() {
    let videoList = ['ngay.mp4', 'dem.mp4'];
    let date = new Date();
    let hour = date.getHours();
    let video = document.getElementById('video');
    if (background.type == 'auto') {
        if (hour >= background.day && hour < background.night) {
            video.src = './src/videos/' + videoList[0];
        } else video.src = './src/videos/' + videoList[1];
    } else if (background.type == 'day') {
        video.src = './src/videos/' + videoList[0];
    } else if (background.type == 'night') {
        video.src = './src/videos/' + videoList[1];
    }
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

        var batteryDischargingTime =
            value.dischargingTime == 'Infinity'
                ? 'Infinity'
                : parseInt(value.dischargingTime / 60, 10);
        if (batteryLevel == 100 && batteryCharging)
            sendNotification(
                'Pin đầy',
                'Pin của bạn đã được sạc đầy vui lòng rút sạc để bảo vệ pin'
            );
        if (batteryChargingTime != 'Infinity' && batteryCharging)
            sendNotification(
                'Thời gian sạc',
                'Pin của bạn sẽ được sạc đầy sau ' + batteryChargingTime + ' phút'
            );
    });
}
navigator
    .getBattery()
    .then(success)
    .catch((error) => console.log(error));

function sendNotification(title = 'Không có tiêu đề', body = 'Không có mô tả') {
    window.electronAPI.setTitle({ title: title, body: body });
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

function getWeather(lat = 20.987904, lon = 105.7947648) {
    var requestOptions = {
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
                localStorage.setItem('weather', JSON.stringify(weather));
            }
        })
        .catch((error) => console.log('error', error));
}

async function setWeatherInScreen() {
    if (localStorage.getItem('position')) {
        let position = JSON.parse(localStorage.getItem('position'));
        await getWeather(position.lat, position.lon);
    } else await getWeather();
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

function convertTZ(date, timeZone) {
    return new Date(
        (typeof date === 'string' ? new Date(date) : date).toLocaleString('vi-VN', {
            timeZone: timeZone,
        })
    );
}
