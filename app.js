require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = parseInt(process.env.API_PORT) || 3000;

// Determine environment
const env = process.env.ENV || 'dev';
const swaggerDocument = require('./api/swagger.json');

// Set the correct host based on the environment
if (env === 'dev') {
    swaggerDocument.host = `localhost:${port}`;
    swaggerDocument.schemes = ['http'];
} else if (env === 'prod') {
    swaggerDocument.host = 'safe-place.flusin.fr';
    swaggerDocument.schemes = ['https'];
}

//// DOCS ROUTE ////
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//// DOCS ROUTE ////

//// API ROUTES ////
const helloWorldRoute = require('./api/routes/hello-world');

app.use('/api/hello-world', helloWorldRoute);
//// API ROUTES ////

//// FRONT-END ROUTES ////
const homepageRoute = require('./api/routes/front/index');

app.use('/', homepageRoute);
//// FRONT-END ROUTES ////


// APP LISTEN //
app.listen(port, () => {
    const baseUrl = env === 'prod' ? 'https://safe-place.flusin.fr' : `http://localhost:${port}`;
    console.log(`Safe place API is listening at ${baseUrl}/api`);
});