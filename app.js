require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
app.use(express.json())
const port = parseInt(process.env.API_PORT) || 3000;

// Determine environment
const env = process.env.ENV || 'dev';
const swaggerDocument = require('./api/swagger.json');

// Set the correct host based on the environment
if (env === 'dev') {
    swaggerDocument.host = `localhost:${port}`;
    swaggerDocument.schemes = ['http'];
} else if (env === 'prod') {
    swaggerDocument.host = 'safe-place-api.flusin.fr';
    swaggerDocument.schemes = ['https'];
}

//// DOCS ROUTE ////
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//// DOCS ROUTE ////

//// API ROUTES ////
const userRoutes = require('./api/routes/users.routes')

app.use('/api/users', userRoutes);
//// API ROUTES ////


// APP LISTEN //
app.listen(port, () => {
    const baseUrl = env === 'prod' ? 'https://safe-place-api.flusin.fr' : `http://localhost:${port}`;
    console.log(`Safe place API is listening at ${baseUrl}/api`);
});