const activeTimers = {
//    userId: {
//          timer:
//          timerStarted
//          timerEnds
//          duration
//          type
//     }
};

export function getTimer(user) {
    return activeTimers[user.id];
}

export function createTimer(type, user, duration, cb) {
    var timer = {
        type,
        timer: setTimeout(cb, duration),
        duration: new Date(duration),
        started: new Date(),
        ends: new Date(new Date() + duration),
    };

    activeTimers[user.id]=timer;
    return timer;
}

export function deleteTimer(user) {
    let timer = getTimer(user);
    clearTimeout(timer.timer);
    delete activeTimers[user.id];
}

export function getTimeLeft(timer) {
    var now = Date.now();
    var ends = timer.ends;

    return Math.ceil((ends - now) / (60*1000));
}
