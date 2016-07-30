import bodyParser from 'body-parser';
import slackMiddleWare from './slack-middleware.js';

export default function configureMiddleware(app){
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.use(slackMiddleWare);
}