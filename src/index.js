// Run dotenv so we can use .env file, do this before anything
require('dotenv').config();

import configureRoutes from "./routes";
import confiureMiddleware from "./middleware";

// Express setup
const PORT = process.env.PORT || 3000;
const app = require('express')();
confiureMiddleware(app);
configureRoutes(app);

app.listen(PORT, function () {
    console.log('Pomobot listening on port '+PORT+'!');
});


