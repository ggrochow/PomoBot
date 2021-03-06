# Simple Pomodoro Bot
![Slack Screenshot](http://i.imgur.com/y2z3NPL.png)
A Very simple approach to a pomodoro timer slack-bot. No external requirements, very little app setup.

It however does have its limitations, The actual timer is held in the apps memory, so any restarts will cause all currently active timers to be lost.

### Setup

#### Slack
You'll need to both an Incoming WebHook and an Outgoing WebHook for this to work. [You can create them here](https://my.slack.com/apps/manage/custom-integrations)

##### Incoming WebHook
This is how the app actually sends messages into slack, feel free to use any channel, and setup what-ever username / picture you want.

##### Outgoing WebHook
This is how we send commands to the bot. this setup is a little more specific. You probably want to use the same channel as you set in your incoming webhook.
The trigger word can be set to anything, Personally I use `!pomo`. URLs, only really need one, point it to where-ever the app is being hosted. No special routes required.
Bot name & icon & label can be set to whatever your heart desires.

Keep note of the token generated, you'll need it later.

#### Required ENV Vars

`OUTGOING_WEBBOOK_TOKEN` should be set to the token associated with the outgoing web-hook. This is used to verify requests actually came from slack.

`INCOMING_WEBHOOK_URL` should be set to the `Webhook URL` given to you when creating the incoming-webhook.


### Running the app
Make sure to `npm install`.

Running `npm start` will build and run the app.
