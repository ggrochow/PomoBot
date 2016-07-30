const bodyParser = require('body-parser');
const slackMiddleWare = require('./slack-middleware.js');

module.exports = function configureMiddleware(app){
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.use('/api/slack/', slackMiddleWare);
}