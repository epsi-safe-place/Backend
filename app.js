require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/swagger.json');
const app = express();
const port = parseInt(process.env.API_PORT) || 3000;

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
    console.log(`Safe place api is listening at http://localhost:${port}/api`)
})