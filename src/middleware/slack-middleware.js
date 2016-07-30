const TOKEN = process.env.OUTGOING_WEBBOOK_TOKEN;

module.exports = function(req, res, next){
    const body = req.body;
    console.log(body);
    if (body.token != TOKEN) {
        console.log("BAD TOKEN - THEY DONT MATCH\n"+body.token+"\n"+TOKEN);
        res.status(401).end();
        return;
    }

    const text = body.text.substring(body.trigger_word.length)
        .trim()
        .split(' ');

    req.command = text[0];
    req.userInput = text.slice(1).join(" ");
    req.user = {
        name: body.user_name,
        id: body.user_id
    };

    next();
}