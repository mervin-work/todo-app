'use strict';

const config = require('../../../constants/authentication');
const redis = require('../../../utils/redis');
const service = require('./service');
const securityUtil = require('../../../utils/security');
const jwtUtil = require('../../../utils/jwt');
const logger = require('../../../utils/logger').child({name: 'auth'});;

exports.generateNonce = () => {
    return async (req, res) => {
        const ipAddress = req.ip; // Get the IP address of the requester
        const rateLimitKey = `ratelimit:${ipAddress}`;

        // Check the number of requests made within the time window
        const requestsCount = await redis.redisClient.zcount(rateLimitKey, '-inf', '+inf');

        if (requestsCount >= config.max_requests_per_minute) {
            return res.status(429).json({
                status: false,
                message: 'Rate limit exceeded. Please try again later.',
            });
        }

        // Add the current request to the sorted set with the current timestamp as the score
        await redis.redisClient.zadd(rateLimitKey, Date.now(), Date.now());

        // generate the nonce hash
        const nonce = securityUtil.generateSessionId(config.nonce_length);
        await redis.addNonce(nonce);

        res.status(201).json({
            status: true,
            message: 'Successfully created nonce hash',
            data: {
                nonce: nonce,
            },
        });
    };
};

exports.signIn = () => {
    return async (req, res) => {
        const {
            username,
            password,
            nonce
        } = req.body;

        try {
            await redis.removeNonce(nonce); // try to remove nonce from redis
            const user = await service.getUserByUsername(username);

            if (!(await securityUtil.comparePasswords(password, user.password))) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid credentials',
                });
            }

            const sessionId = securityUtil.generateSessionId(config.session_id_length);

            const accessToken = jwtUtil.createAccessToken(user.id, process.env.JWT_KEY);
            await redis.saveSession(user.id, sessionId); // save user session

            res.status(201).json({
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
            const statusCode = err?.message === 'User not found' ? 401 : 400;
            const message = err?.message === 'User not found' ? 'Invalid credentials' : err.message;
            res.status(statusCode).json({
                status: false,
                message: message
            });
        }

    }
};

exports.signOut = () => {
    return async (req, res) => {
        await redis.deleteSession(req.userId);
        return res.status(200).json({
            status: true,
            message: 'Successfully signed out',
        });
    };
};