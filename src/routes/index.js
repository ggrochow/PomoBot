import slackOutgoingWebhook from "../pomoBot/outgoing-webhook-resopnse.js"

export default function configureRoutes(app) {
    // Slack Outgoing WebHooks API endpoint.
    app.post('/', slackOutgoingWebhook);
}