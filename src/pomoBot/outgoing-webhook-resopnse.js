import {respond} from "./incoming-webhook-response.js";
import {POMO_TIME_MS, BREAK_TIME_MS} from "./../constants";
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
            sendHelpText(req);
    }

    res.status(200).end();
};

function pomoStart(req) {
    const user = req.user;

    if (!isTimerActive()) {
        createPomo(user);
        respond(req.user, `Pomo Started, ${getMinutesLeft()}m till break.`);
    } else if (!isUserActive(user)) {
        addToTimer(user);
        respond(req.user, `You've been added to the already running ${getTimerType()} Pomo, ${getMinutesLeft()}m left.`);
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

function sendHelpText(req) {
    const triggerWord = req.body.trigger_word;
    let helpText = `Unrecognized command '${triggerWord} ${req.command}'\n`;
    helpText += 'I only understand the following commands\n';
    helpText += `\`${triggerWord} start\` - Starts a new pomodoro for you, or adds you to the currently running one.\n`;
    helpText += `\`${triggerWord} stop\` - Removes you from the currently running pomodoro, stopping it if you're the last one.\n`;
    helpText += `\`${triggerWord} status\` - Lets you know when the current pomodor ends, and who's on it.\n`;
    respond(req.user, helpText);
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
