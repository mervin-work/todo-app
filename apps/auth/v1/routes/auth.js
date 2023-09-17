'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const { signInRequestSchema } = require('../requests/auth');
const validator = require('express-joi-validation').createValidator({});
const authenticateUser = require('../../../../middlewares/auth');

/**
 * Auth Routes
 * 
*/
const routes = () => {
    
    router.post('/nonces',  auth.generateNonce());
    router.post('/signin', validator.body(signInRequestSchema), auth.signIn());
    router.post('/signout',  authenticateUser, auth.signOut());
    return router;

};

module.exports = routes;
