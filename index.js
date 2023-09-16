'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutesV1 = require('./apps/auth/routes/v1/auth');
const todoRoutesV1 = require('./apps/todo/routes/v1/todo');
const PORT = process.env.PORT || 3005;
const app = express();

// JSON body parsing middleware
app.use(express.json());

// allowing specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({ origin: allowedOrigins }));

// pino logger middleware 
const logger = require('./utils/logger').child({name: 'app'});

// inject the routes
const apiV1 = '/api/v1';
app.use(`${apiV1}/auth`, authRoutesV1());
app.use(`${apiV1}/todos`, todoRoutesV1())
// db connection
require('./models');

app.listen(PORT, () => {
    logger.info('Express server listening on port ' + PORT);
});

module.exports = app;