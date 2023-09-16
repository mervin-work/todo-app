'use strict';
const logger = require('../../../../utils/logger').child({name: 'auth'});
const {create, 
       update,
       findAll,
       findByPk,
       destroy
} = require('../../services/v1/todo');
const httpConstants = require('http2').constants;

/**
 * Todo Controllers
 * 
 */

//Create Todo
const createTodo = ()=> {

    return (req, res) =>
    create(req.body.data)
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
const findAllTodo = () => {

    return (req, res) => {
        findAll(req.query.limit, req.query.offset)
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
const findByPkTodo = () => {
    return (req, res) => {
        findByPk(req.params.id)
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
const updateTodo = ()=> {
    return (req, res) => {
        update(req.params.id, req.body.data)
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
const destroyTodo = () => {
    return (req, res) => {
        destroy(req.params.id)
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
    createTodo, findAllTodo, 
    findByPkTodo, updateTodo, destroyTodo 
}