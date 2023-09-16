'use strict';

const express = require('express');
const router = express.Router();
const { generateNonce, signIn, signOut } = require('../../controllers/v1/auth');
const { signInRequestSchema } = require('../../requests/v1/auth');
const validator = require('express-joi-validation').createValidator({});
const authenticateUser = require('../../../../middlewares/auth');

/**
 * Auth Routes
 * 
*/
const routes = () => {
    
    router.post('/nonces',  generateNonce());
    router.post('/signin', validator.body(signInRequestSchema), signIn());
    router.post('/signout',  authenticateUser, signOut());
    return router;

};

module.exports = routes;
