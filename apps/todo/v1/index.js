'use strict';

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const controller = require('./controller');

// schema for adding or updating todo
const todoSchema = Joi.object({
    title: Joi.string().min(4).required(),
    description: Joi.string().required(),
    completed: Joi.boolean().required(),
    due_date: Joi.date().required()
});

const patchTodoSchema = Joi.object({
    title: Joi.string().min(4),
    description: Joi.string(),
    completed: Joi.boolean(),
    due_date: Joi.date()
}).min(1); // Ensure at least one property is provided

// id schema for url params
const idSchema = Joi.object({
    id: Joi.number().integer().required()
});

// schema for get request
const getSchema = Joi.object({
    limit: Joi.number().integer().default(1000),
    offset: Joi.number().integer().default(0),
}).default();

// routes for todo
function routes() {
    router.post('/', validator.body(todoSchema), controller.addTodo());
    router.get('/', validator.query(getSchema), controller.getTodos());
    router.get('/:id', validator.params(idSchema), controller.getTodoById());
    router.delete('/:id', validator.params(idSchema), controller.deleteTodoById());
    router.put('/:id', validator.params(idSchema), validator.body(todoSchema), controller.updateTodoById());
    router.patch('/:id', validator.params(idSchema), validator.body(patchTodoSchema), controller.updateTodoById());

    return router;
}

module.exports = routes;