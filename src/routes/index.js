module.exports = function configureRoutes(app) {
    // Slack Outgoing WebHooks API endpoint.
    app.post('/api/slack', require('./slack.js'));
}