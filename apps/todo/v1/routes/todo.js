'use strict';
const express = require('express');
const router = express.Router();
const todo = require('../controllers/todo');
const { postRequestSchema, patchRequestSchema, 
    getRequestSchema, idSchema
} = require('../requests/todo');
const validator = require('express-joi-validation').createValidator({});
const authenticateUser = require('../../../../middlewares/auth');
/**
 * Todo Routes
 * 
 */
const routes = () => {
    router.use(authenticateUser);
    router.post('/',validator.body(postRequestSchema), todo.create());
    router.get('/', validator.query(getRequestSchema), todo.findAll());
    router.get('/:id', validator.params(idSchema), todo.findByPk() );
    router.delete('/:id', validator.params(idSchema), todo.destroy());
    router.put('/:id', validator.params(idSchema), validator.body(postRequestSchema), todo.update());
    router.patch('/:id', validator.params(idSchema), validator.body(patchRequestSchema), todo.update());
    return router;
};

module.exports = routes;