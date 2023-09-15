'use strict';

const service = require('./service');
const logger = require('../../../utils/logger').child({name: 'todo'});;

// Controller for adding Todo
exports.addTodo = () => {
    return (req, res) =>
        service
            .addTodo(req.body)
            .then(data => {
                res.status(201).json({
                    status: true,
                    message: "Todo successfully created!",
                    data: data
                });
            })
            .catch(err => {
                logger.error(err);
                res.status(400)
                    .json({
                        status: false,
                        message: err.message
                    })
            })
};

// Controller for listing Todo
exports.getTodos = () => {
    return (req, res) => {
        service.getTodos(req.query)
            .then(data => {
                res.status(200).json({
                    status: true,
                    message: "Successfully retrieved data",
                    data: data
                });
            })
            .catch(err => {
                logger.error(err);
                res.status(400).json({
                    status: false,
                    message: err.message
                });
            });
    }
};

// Controller for letting Todo details
exports.getTodoById = () => {
    return (req, res) => {
        service.getTodoById(req.params.id)
            .then(data => {
                res.status(200).json({
                    status: true,
                    message: "Successfully retrieved todo data",
                    data: data
                });
            })
            .catch(err => {
                logger.error(err)
                const statusCode = err?.message === 'Todo not found' ? 404 : 400;
                res.status(statusCode).json({
                    status: false,
                    message: err.message
                });
            });
    }
};

// Controller for deleting Todo
exports.deleteTodoById = () => {
    return (req, res) => {
        service.deleteTodoById(req.params.id)
            .then(() => {
                res.status(204).json();
            })
            .catch(err => {
                logger.error(err)
                const statusCode = err?.message === 'Todo not found' ? 404 : 400;
                res.status(statusCode).json({
                    status: false,
                    message: err.message
                });
            });
    }
};

// Controller for updating Todo details
exports.updateTodoById = () => {
    return (req, res) => {
        service.updateTodoById(req.params.id, req.body)
            .then(data => {
                res.status(200).json({
                    status: true,
                    message: "Todo successfully updated",
                    data: data
                });
            })
            .catch(err => {
                logger.error(err)
                const statusCode = err?.message === 'Todo not found' ? 404 : 400;
                res.status(statusCode).json({
                    status: false,
                    message: err.message
                });
            });
    }
};