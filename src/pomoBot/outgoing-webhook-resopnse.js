import {respond} from "./incoming-webhook-response.js";
import {
    removeFromTimer,
    createTimer,
    getMinutesLeft,
    addToTimer,
    isTimerActive,
    isUserActive,
    getTimerType,
    getActiveUsers,
    getFormattedEndtime
} from "./timer.js";
import {GRACE_PERIOD, POMO_TIME_MS, BREAK_TIME_MS} from "./../constants";

export default function slackOutgoingWebhook(req, res) {

    switch (req.command) {
        case "start":
            pomoStart(req);
            break;
        case "stop":
            pomoStop(req);
            break;
        case "status":
            pomoStatus(req);
            break;
        default:
            //TODO: help text
            //TODO: take this as complete command
            respond(req.user, "Unrecognized command ' " + req.command + " '");
    }

    res.status(200).end();
};

function pomoStart(req) {
    const user = req.user;

    if (!isTimerActive()) {
        createPomo(user);
        respond(req.user, `Pomo Started, ${getMinutesLeft()}m till break.`);
    } else if (!isUserActive(user) && getMinutesLeft() < GRACE_PERIOD) {
        addToTimer(user);
        respond(req.user, `You've been added to the already running ${getTimerType()} Pomo, ${getMinutesLeft()}m left.`);

    } else if (!isUserActive(user)) {
        addToNextTimer(user);
        respond(req.user, `Theres already a ${getTimerType()} Pomo running, and you're over the ${GRACE_PERIOD}m grace period.` +
            ` I'll add you to the next one in ${getMinutesLeft()}m`)
    } else if (isUserActive(user)) {
        respond(req.user, `You're already on an active ${getTimerType()} Pomo with ${getMinutesLeft()}m, left.`)
    } else {
        respond(req.user, "something went wrong");
    }
}

function pomoStop(req) {
    removeFromTimer(req.user);
    const responseText = isTimerActive() ? `You have been removed from the running ${getTimerType()} Pomo` : `${getTimerType()} Pomo has been stopped.`;
    respond(req.user, responseText)
}

function pomoStatus(req) {
    if (isTimerActive()) {
        respond(req.user, `${getTimerType()} Pomo active for ${getActiveUsers().map(user => user.name).join(", ")} ${getMinutesLeft()}m remaining. (${getFormattedEndtime()})`)
    }
}
function createPomo(user) {
    createTimer("Work", POMO_TIME_MS, pomoEnded);
    addToTimer(user)
}

function createBreak(user) {
    createTimer("Break", BREAK_TIME_MS, breakEnded);
    addToTimer(user);
}

function pomoEnded() {
    const users = getActiveUsers();
    respond(users, `The Work Pomo ended, take a ${BREAK_TIME_MS / (1000 * 60)}m break!`);
    createBreak(users);
}

function breakEnded() {
    const users = getActiveUsers();
    respond(users, `The Break Pomo ended, ${POMO_TIME_MS / (1000 * 60)}m of work, go!`);
    createPomo(users);
}

export function addToNextTimer(user) {
    const nextEnd = getMinutesLeft() * (60 * 1000);
    // TODO: make this cancelable
    setTimeout(() => {
        addToTimer(user);
        respond(user, `You've been added to the ${getTimerType()} Pomo, ${getMinutesLeft()}m left.`);
    }, nextEnd + 5000)
}

