'use strict';

const Joi = require('joi');

const signInRequestSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    nonce: Joi.string().required()
});

module.exports = {
    signInRequestSchema
}