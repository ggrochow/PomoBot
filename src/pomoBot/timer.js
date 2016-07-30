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
        timer: setTimeout(cb, duration),
        duration: duration,
        started: Date.now(),
        ends: Date.now() + duration,
        type: type
    };
    activeTimers[user.id]=timer;
    return timer;
}

export function deleteTimer(user) {
    delete activeTimers[user.id];
}

export function getTimeLeft(timer) {
    var now = Date.now();
    var ends = timer.ends;

    return Math.ceil((ends - now) / (60*1000));
}
