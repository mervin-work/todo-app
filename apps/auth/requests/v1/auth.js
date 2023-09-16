'use strict';

const Joi = require('joi');

/**
 * Auth Routes
 * 
*/

//Sign-in request schema validator
const signInRequestSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    nonce: Joi.string().required()
});

module.exports = {
    signInRequestSchema
}