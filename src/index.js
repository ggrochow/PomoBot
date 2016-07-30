// Run dotenv so we can use .env file
require('dotenv').config();

const configureRoutes = require("./routes/index.js");
const confiureMiddleware = require("./middleware/index.js");

// Express setup
const PORT = process.env.PORT || 3000;
const app = require('express')();
confiureMiddleware(app);
configureRoutes(app);
app.listen(PORT, function () {
    console.log('Example app listening on port '+PORT+'!');
});


