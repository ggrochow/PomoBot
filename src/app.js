import express from 'express';

import configureRoutes from "./routes";
import confiureMiddleware from "./middleware";

// Express setup
const PORT = process.env.PORT || 3000;
const app = express();
confiureMiddleware(app);
configureRoutes(app);

app.listen(PORT, function () {
    console.log('Pomobot listening on port '+PORT+'!');
});