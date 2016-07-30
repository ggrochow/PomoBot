const respond = require("./slack/webhook-response.js");

module.exports = function slackOutgoingWebhook(req, res) {

    switch (req.command) {
        case "start":
            pomoStart(req, res);
            break;
        case "stop":
            pomoStop(req, res);
            break;
        default:
            //TODO: help text
            //TODO: take this as complete command
            res.json({text: "Unrecognized command ' "+req.command+" '."});
    }

    res.status(200).end();
};

const activeTimers = {
//    userId: {
//          timer:
//          timerStarted
//          timerEnds
//          duration
//          type
//     }
};

function pomoStart(req, res) {
    var user = req.user;
    var timer = getTimer(user);
    if (!timer) {
        timer = createPomo(user);
    }

    res.json({
        text: at(user) + getTimeLeft(timer) + "m remaining until you are done with " + timer.type
    });
}

function pomoStop(req, res) {

}

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

function getTimeLeft(timer) {
    var now = Date.now();
    var ends = timer.ends;

    return Math.ceil((ends - now) / (1000));
}

function createPomo(user) {
    return createTimer("Pomodoro", user, 1000*30, function(){
        pomoEnded(user);
    });
}

function createBreak(user) {
    return createTimer("Break", user, 1000*5, function(){
        breakEnded(user);
    });
}

function pomoEnded(user) {
    console.log(user.name + ' - pomo ended')
    createBreak(user);
    respond(user, "Your pomo has ended, 5m break, go!");
}

function breakEnded(user) {
    console.log(user.name + ' - break ended')
    createPomo(user);
    respond(user, "Your pomo has ended, time to work for 30m, go!");
}

function at(user) {
    return "<@" + user.id + "|" + user.name + ">: ";
}