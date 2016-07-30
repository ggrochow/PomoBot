import request from 'request';

export function respond(user, message) {

    request({
        url: process.env.INCOMING_WEBHOOK_URL,
        method: 'POST',
        json: true,
        body: {
            text: "<@"+user.id+"|"+user.name+">:"+message,
        }
    });
};