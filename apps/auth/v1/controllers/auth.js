'use strict';

const config = require('../../../../constants/authentication');
const redis = require('../../../../utils/redis');
const authService = require('../services/auth');
const { findUserByUsername } = require('../../../user/services/user');
const securityUtil = require('../../../../utils/security');
const jwtUtil = require('../../../../utils/jwt');
const logger = require('../../../../utils/logger').child({name: 'auth'});
const httpConstants = require('http2').constants;

/**
 * Auth Controller
 *
*/

const generateNonce = () => {
    return (req, res) =>
    authService.generateNonce(req.ip)
    .then(data => {
         res.status(httpConstants.HTTP_STATUS_CREATED).json({
            status: true,
            message: 'Nonce hash successfully created',
            data: {
                nonce: data,
            },
        });
    })
    .catch(err => {
        logger.error(err);
        res.status(httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS).json({
                    status: false,
                    message: err.message,
                });
    });
};

const signIn = () => {
    return (req, res) => {
        const {username, password, nonce} = req.body;
        authService.signIn(username, password, nonce)
        .then(data => {
            res.status(httpConstants.HTTP_STATUS_CREATED).json({
               status: true,
               message: 'User successfully signed in',
               data,
           });
       })
       .catch(err => {
            logger.error(err);

            const statusCode = err?.message === 'User not found' ? 
                httpConstants.HTTP_STATUS_UNAUTHORIZED : httpConstants.HTTP_STATUS_BAD_REQUEST;
            
            const message = err?.message === 'User not found' ? 'User not found' : err.message;    
            res.status(statusCode).json({
                status: false,
                message: message
            });
       });
    };
};

const signOut = () => {
    return (req, res) => {
        authService.signOut(req.userId)
        .then(() => {
            res.status(httpConstants.HTTP_STATUS_OK).json({
                status: true,
                message: 'User successfully signed out',
            });
        })
        .catch(err => {
            logger.error(err);
          
            res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                status: false,
                message: err.message
            });
       });
    }
}

module.exports = {
    generateNonce,
    signIn,
    signOut
};