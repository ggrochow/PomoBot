// const pomoEnded = require("./pomo-ended");
var request = require('request');

const activeTimers = {
//    userId: {
//          timer:
//          timerStarted
//          timerEnds
//          duration
//     }
};

module.exports = function pomoStart(req, res) {
    var user = req.user;
    var timer = getTimer(user);
    if (!timer) {
        timer = createTimer("Pomodoro",
            function(){
                pomoEnded(user);
            }, 1000*60*30);
    }

    res.json({
        text: at(user) + getTimeLeft(timer) + "m remaining until you are done with " + timer.type
    });

    saveTimer(user, timer);
};

function saveTimer(user, timer) {
    activeTimers[user.id] = timer;
}

function getTimer(user) {
    return activeTimers[user.id];
}

function createTimer(type, cb, duration) {
    var now = Date.now();
    var ends = now + duration;

    return {
        timer: setTimeout(cb, duration),
        duration: duration,
        started: now,
        ends: ends,
        type: type
    }
}

function getTimeLeft(timer) {
    var now = Date.now();
    var ends = timer.ends;

    return Math.ceil((ends - now) / (1000*60));
}

function pomoEnded(user) {
    console.log("POMO ENDED");
    createTimer("break", function(){

    }, 1000*60*5)
    request({
        url: process.env.INCOMING_WEBHOOK_URL,
        method: 'POST',
        json: true,
        body: {
            text: at(user) + "Your pomo has ended, 5m break, go!",
        }
    });
}

function at(user) {
    return "<@" + user.id + "|" + user.name + ">: ";
}