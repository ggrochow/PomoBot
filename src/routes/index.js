module.exports = function configureRoutes(app) {
    // Slack Outgoing WebHooks API endpoint.
    app.post('/', require('./slack.js'));
}