import express from "express";
import configureRoutes from "./routes";
import configureMiddleware from "./middleware";

// Express setup
const PORT = process.env.PORT || 3000;
const app = express();

configureMiddleware(app);
configureRoutes(app);

app.listen(PORT, function () {
    console.log('Pomobot listening on port '+PORT+'!');
});