var request = require('request');

module.exports = function respond(user, message) {

    request({
        url: process.env.INCOMING_WEBHOOK_URL,
        method: 'POST',
        json: true,
        body: {
            text: "<@"+user.id+"|"+user.name+">:"+message,
        }
    });
};