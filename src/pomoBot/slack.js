var respond = require("./slack/webhook-response.js");
const timer = require("./timer.js");
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

function pomoStart(req, res) {
    var user = req.user;
    var timer = timer.getTimer(user);
    if (!timer) {
        timer = createPomo(user);
    }
    respond(req.user, "" + timer.getTimeLeft(timer) + "m remaining until you are done with " + timer.type);
}

function pomoStop(req, res) {
    timer.deletetimer(req.user);
    respond(req.user, "Your timer has been stopped")
}

function createPomo(user) {
    return timer.createTimer("Pomodoro", user, 1000*60*30, function(){
        pomoEnded(user);
    });
}

function createBreak(user) {
    return timer.createTimer("Break", user, 1000*60*5, function(){
        breakEnded(user);
    });
}

function pomoEnded(user) {
    createBreak(user);
    respond(user, "Your pomo has ended, 5m break, go!");
}

function breakEnded(user) {
    createPomo(user);
    respond(user, "Your pomo has ended, time to work for 30m, go!");
}

function at(user) {
    return "<@" + user.id + "|" + user.name + ">: ";
}