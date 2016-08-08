import request from "request";

export function respond(users, message) {

    request({
        url: process.env.INCOMING_WEBHOOK_URL,
        method: 'POST',
        json: true,
        body: {
            text: getAts(users) + " " + message,
        }
    });
}

function getAts(user) {
    let users = [];
    if (Array.isArray(user)) {
        users = user;
    } else {
        users = [user];
    }
    return users
        .map(user => "<@" + user.id + "|" + user.name + ">")
        .join(", ")
}