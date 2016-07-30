const pomoStart = require("./slack/pomo-start.js");

module.exports = function slackOutgoingWebhook(req, res) {

    switch (req.command) {
        case "start":
            pomoStart(req, res);
            break;
        default:
            //TODO: help text
            //TODO: take this as complete command
            res.json({text: "Unrecognized command ' "+req.command+" '."});
    }

    res.status(200).end();
};

