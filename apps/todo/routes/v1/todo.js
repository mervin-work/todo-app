'use strict';
const express = require('express');
const router = express.Router();
const todo = require('../../controllers/v1/todo');
const { postRequestSchema, patchRequestSchema, 
    getRequestSchema, idSchema
} = require('../../requests/v1/todo');
const validator = require('express-joi-validation').createValidator({});
const authenticateUser = require('../../../../middlewares/auth');
/**
 * Todo Routes
 * 
 */
const routes = () => {
    router.post('/',validator.body(postRequestSchema), todo.createTodo());
    router.get('/', validator.query(getRequestSchema), todo.findAllTodo());
    router.get('/:id', validator.params(idSchema), todo.findByPkTodo() );
    router.delete('/:id', validator.params(idSchema), todo.destroyTodo());
    router.put('/:id', validator.params(idSchema), validator.body(postRequestSchema), todo.updateTodo());
    router.patch('/:id', validator.params(idSchema), validator.body(patchRequestSchema), todo.updateTodo());
    // router.use(authenticateUser);
    return router;
};

module.exports = routes;