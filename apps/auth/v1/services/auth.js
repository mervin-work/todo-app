'use strict';

const models = require('../../../../models');
const config = require('../../../../constants/authentication');
const redis = require('../../../../utils/redis');
const securityUtil = require('../../../../utils/security');
const jwtUtil = require('../../../../utils/jwt');
const logger = require('../../../../utils/logger').child({name: 'auth'});
const userService = require('../../../user/services/user');
/**
 * Auth Service
 * 
*/

/**
 * 
 * @param {string} ipAddress - IP Address of the requester
 * @returns {string} Generated nonce hash
 */
const generateNonce = async(ipAddress) => {
    const rateLimitKey = `ratelimit:${ipAddress}`;
  // Check the number of requests made within the time window
    const requestsCount = await redis.redisClient.zcount(rateLimitKey, '-inf', '+inf');

    if (requestsCount >= config.max_requests_per_minute) 
        throw new Error('Rate limit exceeded. Please try again later.')

    // Add the current request to the sorted set with the current timestamp as the score
    await redis.redisClient.zadd(rateLimitKey, Date.now(), Date.now());

    // generate the nonce hash
    const nonce = securityUtil.generateSessionId(config.nonce_length);
    await redis.addNonce(nonce);

    return nonce;
};

/**
 * @param {string} username - Username of the user
 * @param {string} password - Password of the user
 * @param {string} nonce - Generated nonce
 * @returns {Promise<Object>} - A Promise that resolves to the user object with access token.
 */
const signIn = async(username, password, nonce) => {
    // console.log(`service`);
    // console.log(username, password, nonce);
    //remove nonce
    await redis.removeNonce(nonce);
    const user = await userService.findUserByUsername(username);

    if(!(await securityUtil.comparePasswords(password, user.password)))
        throw new Error('Invalid credentials')

    const sessionId = securityUtil.generateSessionId(config.session_id_length);
    const access_token = jwtUtil.createAccessToken(user.id, process.env.JWT_KEY);
    // save user session
    await redis.saveSession(user.id, sessionId); 

    return { user, access_token, 
        ttl: config.session_max_age
    };
}

const signOut = async (userId) => {
    await redis.deleteSession(userId);
};

module.exports = {
    generateNonce, signIn, signOut
}