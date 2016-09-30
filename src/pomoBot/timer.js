import dateFormat from "dateformat";

const Timer = {
    users: {},
    running: false,
};

export function isTimerActive() {
    return Timer.running;
}

export function isUserActive(user) {
    return isTimerActive() && Timer.users[user.id];
}

export function addToTimer(user) {
    let users;

    if (Array.isArray(user)) {
        users = user;
    } else {
        users = [user];
    }

    users.forEach(u => Timer.users[u.id] = u);
}

export function removeFromTimer(user) {
    delete Timer.users[user.id];

    if (getActiveUsers().length === 0) {
        clearTimer();
    }
}

export function getActiveUsers() {
    return Object.keys(Timer.users).map(userName => Timer.users[userName]);
}

export function getTimerType() {
    return Timer.type;
}

function clearTimer() {
    clearTimeout(Timer.timer);
    Timer.running = false;
}

export function createTimer(type, duration, cb) {
    Object.assign(Timer, {
        type,
        timer: setTimeout(cb, duration),
        duration: new Date(duration),
        started: new Date(),
        endTime: new Date(new Date().getTime() + duration),
    });

    Timer.running = true;
    return Timer;
}

export function getMinutesLeft() {
    return Math.ceil(getTimeLeft() / (60 * 1000));
}

export function getTimeLeft() {
    var now = new Date().getTime();
    var ends = Timer.endTime.getTime();

    return ends - now;
}

export function getFormattedEndtime() {
    return dateFormat(Timer.endTime, "h:MM TT");
}
