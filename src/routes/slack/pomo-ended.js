var request = require('request');

module.exports = function pomoEnded(user) {
    console.log("POMO ENDED");
    request({
        url: process.env.INCOMING_WEBHOOK_URL,
        method: 'POST',
        json: true,
        body: {
            text: "<@"+user.id+"|"+user.name+">: Your pomo has ended, 5m break, go!",
        }
    });
};