module.exports = function configureRoutes(app) {
    // Slack Outgoing WebHooks API endpoint.
    app.post('/', require('./../pomoBot/slack.js'));
}