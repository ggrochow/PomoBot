const activeTimers = {
//    userId: {
//          timer:
//          timerStarted
//          timerEnds
//          duration
//          type
//     }
};

function getTimer(user) {
    return activeTimers[user.id];
}

function createTimer(type, user, duration, cb) {
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

function deletetimer(user) {
    delete activeTimers[user.id];
}

function getTimeLeft(timer) {
    var now = Date.now();
    var ends = timer.ends;

    return Math.ceil((ends - now) / (60*1000));
}

module.exports = {
    getTimer: getTimer,
    getTimeLeft: getTimeLeft,
    deleteTimer: deletetimer,
    createTimer: createTimer
};