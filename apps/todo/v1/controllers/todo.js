'use strict';
const logger = require('../../../../utils/logger').child({name: 'auth'});
const todoService = require('../services/todo');
const httpConstants = require('http2').constants;

/**
 * Todo Controllers
 * 
 */

//Create Todo
const create = ()=> {

    return (req, res) =>
    todoService.create(req.body.data)
    .then(data => {
        res.status(httpConstants.HTTP_STATUS_CREATED).json({
            status: true,
            message: "Todo successfully created",
            data: data
        });
    })
    .catch(err => {
        logger.error(err);
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
            .json({
                status: false,
                message: err.message
            })
    });
};

//Find All Todos
const findAll = () => {

    return (req, res) => {
        todoService.findAll(req.query.limit, req.query.offset)
            .then(data => {
                res.status(httpConstants.HTTP_STATUS_OK).json({
                    status: true,
                    message: "Todo successfully retrieved",
                    data: data
                });
            })
            .catch(err => {
                logger.error(err);
                res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).json({
                    status: false,
                    message: err.message
                });
            });
    }
};

//Find Todo
const findByPk = () => {
    return (req, res) => {
        todoService.findByPk(req.params.id)
        .then(data => {
            res.status(httpConstants.HTTP_STATUS_OK).json({
                status: true,
                message: "Todo successfully retrieved",
                data: data
            });
        })
        .catch(err => {
            logger.error(err)
            res.status(httpConstants.HTTP_STATUS_NOT_FOUND).json({
                status: false,
                message: err.message
            });
        });
    };
}


//Update Todo
const update = ()=> {
    return (req, res) => {
        todoService.update(req.params.id, req.body.data)
            .then(data => {
                res.status(httpConstants.HTTP_STATUS_OK).json({
                    status: true,
                    message: "Todo successfully updated",
                    data: data
                });
            })
            .catch(err => {
                logger.error(err)
                const statusCode = err?.message === 'Todo not found' ? 
                httpConstants.HTTP_STATUS_NOT_FOUND : httpConstants.HTTP_STATUS_BAD_REQUEST;
                res.status(statusCode).json({
                    status: false,
                    message: err.message
                });
            });
    };
};

//Destroy Todo
const destroy = () => {
    return (req, res) => {
        todoService.destroy(req.params.id)
            .then(() => {
                res.status(httpConstants.HTTP_STATUS_OK).json({
                    status: true,
                    message: "Todo successfully deleted",
                });
            })
            .catch(err => {
                logger.error(err)
                res.status(httpConstants.HTTP_STATUS_NOT_FOUND).json({
                    status: false,
                    message: err.message
                });
            });
    };
};

module.exports = {
    create, findAll, 
    findByPk, update, destroy
}