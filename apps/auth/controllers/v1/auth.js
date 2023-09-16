'use strict';

const config = require('../../../../constants/authentication');
const redis = require('../../../../utils/redis');
const { getUserByUsername } = require('../../services/v1/auth');
const securityUtil = require('../../../../utils/security');
const jwtUtil = require('../../../../utils/jwt');
const logger = require('../../../../utils/logger').child({name: 'auth'});
const httpConstants = require('http2').constants;

/**
 * Auth Controller
 *
*/

const generateNonce = () => {

    return async(req, res) => {
        
        //get the IP address of the requester
        const ipAddress = req.ip;
        // const rateLimitKey = `ratelimit:${ipAddress}`;
        
        // // Check the number of requests made within the time window
        // const requestsCount = await redis.redisClient.zcount(rateLimitKey, '-inf', '+inf');

        // if (requestsCount >= config.max_requests_per_minute) {
        //     return res.status(httpConstants.HTTP_STATUS_TOO_MANY_REQUESTS).json({
        //         status: false,
        //         message: 'Rate limit exceeded. Please try again later.',
        //     });
        // }

        // Add the current request to the sorted set with the current timestamp as the score
        // await redis.redisClient.zadd(rateLimitKey, Date.now(), Date.now());

        // generate the nonce hash
        const nonce = securityUtil.generateSessionId(config.nonce_length);
        await redis.addNonce(nonce);

         res.status(httpConstants.HTTP_STATUS_CREATED).json({
            status: true,
            message: 'Successfully created nonce hash',
            data: {
                nonce: nonce,
            },
        });
    }

};

const signIn = () => {
    return async (req,res) => {
        const { username, password, nonce} = req.body;
        try {
            await redis.removeNonce(nonce);
            console.log(username);
            const user = await getUserByUsername(username);

            if (!(await securityUtil.comparePasswords(password, user.password))) {
                return res.status(httpConstants.HTTP_STATUS_UNAUTHORIZED).json({
                    status: false,
                    message: 'Invalid credentials',
                });
            }

            const sessionId = securityUtil.generateSessionId(config.session_id_length);
            const accessToken = jwtUtil.createAccessToken(user.id, process.env.JWT_KEY);
            await redis.saveSession(user.id, sessionId); // save user session

            res.status(httpConstants.HTTP_STATUS_CREATED).json({
                status: true,
                message: 'User signed in successfully',
                data: {
                    user: {
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname
                    },
                    access_token: accessToken,
                    ttl: config.session_max_age
                }
            });

        } catch (err) {
            logger.error(err);
            const statusCode = err?.message === 'User not found' ? 
                httpConstants.HTTP_STATUS_UNAUTHORIZED : httpConstants.HTTP_STATUS_BAD_REQUEST;
            const message = err?.message === 'User not found' ? 'Invalid credentials' : err.message;
            res.status(statusCode).json({
                status: false,
                message: message
            });
        }
    }
};

const signOut = () => {
    return async (req, res) => {
        await redis.deleteSession(req.userId);
        return res.status(httpConstants.HTTP_STATUS_OK).json({
            status: true,
            message: 'Successfully signed out',
        });
    }
}

module.exports = {
    generateNonce,
    signIn,
    signOut
};