'use strict';

const Joi = require('joi');
/**
 * Todo Requests
 * 
 */

const postRequestSchema = Joi.object({
    data: {
        title: Joi.string().min(4).required(),
        description: Joi.string().required(),
        completed: Joi.boolean().required(),
        due_date: Joi.date().required()
    }
});

const patchRequestSchema = Joi.object({
    data: {
        title: Joi.string().min(4),
        description: Joi.string(),
        completed: Joi.boolean(),
        due_date: Joi.date()
    }
}).min(1); // Ensure at least one property is provided 

// id schema for url params
const idSchema = Joi.object({
    id: Joi.number().integer().required()
});

// schema for get request
const getRequestSchema = Joi.object({
    limit: Joi.number().integer().default(10),
    offset: Joi.number().integer().default(1),
}).default();


module.exports = {
    postRequestSchema, patchRequestSchema,
    getRequestSchema, idSchema
}