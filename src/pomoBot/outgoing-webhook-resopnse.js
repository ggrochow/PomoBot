import { respond } from "./incoming-webhook-response.js";
import { getTimer, deleteTimer, createTimer, getTimeLeft } from "./timer.js";


export default function slackOutgoingWebhook(req, res) {

    switch (req.command) {
        case "start":
            pomoStart(req);
            break;
        case "stop":
            pomoStop(req);
            break;
        default:
            //TODO: help text
            //TODO: take this as complete command
            respond(req.user, "Unrecognized command ' "+req.command+" '.");
    }

    res.status(200).end();
};

function pomoStart(req) {
    var user = req.user;
    var timer = getTimer(user);
    if (!timer) {
        timer = createPomo(user);
    }
    respond(req.user, "" + getTimeLeft(timer) + "m remaining until you are done with " + timer.type);
}

function pomoStop(req) {
    deleteTimer(req.user);
    respond(req.user, "Your timer has been stopped")
}

function createPomo(user) {
    return createTimer("Pomodoro", user, 1000*60*30, function(){
        pomoEnded(user);
    });
}

function createBreak(user) {
    return createTimer("Break", user, 1000*60*5, function(){
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