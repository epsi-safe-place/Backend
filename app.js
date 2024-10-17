require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
app.use(express.json({ limit: '100mb' }));
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
const postRoutes = require('./api/routes/posts.routes')
const commentRoutes = require('./api/routes/comments.routes')
const messageRoutes = require('./api/routes/messages.routes')
const notificationRoutes = require('./api/routes/notifications.routes')
const settingsRoutes = require('./api/routes/settings.routes')
const conversationRoutes = require('./api/routes/conversations.routes')
const apiResultRoutes = require('./api/routes/api_results.routes')
const categoriesRoutes = require('./api/routes/categories.routes')
const friendsRoutes = require('./api/routes/friends.routes')
const reportsRoutes = require('./api/routes/reports.routes')
const reportsAssociationsRoutes = require('./api/routes/reports_associations.routes')
const discussRoutes = require('./api/routes/discuss.routes')
const openaiApiRoutes = require('./api/routes/openai_api.routes')

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/api_results', apiResultRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reports_associations', reportsAssociationsRoutes);
app.use('/api/discuss', discussRoutes);
app.use('/api/openai_api', openaiApiRoutes);
//// API ROUTES ////


// APP LISTEN //
app.listen(port, () => {
    const baseUrl = env === 'prod' ? 'https://safe-place-api.flusin.fr' : `http://localhost:${port}`;
    console.log(`Safe place API is listening at ${baseUrl}/api`);
});