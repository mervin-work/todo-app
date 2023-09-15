'use strict';

const express = require('express');
const routes = express.Router();
const authRoutesV1 = require('../apps/auth/routes/v1/auth');
const authenticateUser = require('../middlewares/auth');

// v1 apis
routes.use('/v1/auth', authRoutesV1());


const todo = require("../apps/todo/v1");
routes.use('/v1/todos', authenticateUser, todo());

//end: v1 apis

module.exports = routes;