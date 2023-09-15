'use strict';

const Redis = require('ioredis');
const redisClient = new Redis();

const config = require('../constants/authentication');

/**
 * Adds a nonce to the Redis list. The maximum number of entries in the list is 99. If the list already contains 99 items, the oldest item will be replaced.
 *
 * @param {string} nonce - The nonce to add.
 * @returns {Promise} A Promise that resolves when the nonce is successfully added.
 * @throws {Error} If the nonce cannot be added.
 */
exports.addNonce = async (nonce) => {
    await redisClient.lpush('nonces', nonce);
    await redisClient.ltrim('nonces', 0, 99); // only store upto 99 entries
}

/**
 * Removes a nonce from the Redis list.
 *
 * @param {string} nonce - The nonce to remove.
 * @returns {Promise<number>} A Promise that resolves with the number of removed nonces.
 * @throws {Error} If the nonce is not found or cannot be removed.
 */
exports.removeNonce = async (nonce) => {
    const result = await redisClient.lrem('nonces', 0, nonce);
    if (!result) {
        throw new Error("Invalid nonce");
    }
    return result;
};

/**
 * Saves a session ID in Redis with an expiration time.
 *
 * @param {number|string} userId - The ID of the user associated with the session.
 * @param {string} sessionId - The session ID to save.
 * @returns {Promise} A Promise that resolves when the session is successfully saved.
 */
exports.saveSession = async (userId, sessionId) => {
    await redisClient.set(String(userId), sessionId);
    await redisClient.expire(String(userId), config.session_max_age); // expires in 1 hour
};

/**
 * Deletes a session from Redis.
 *
 * @param {number|string} userId - The ID of the user associated with the session.
 * @returns {Promise} A Promise that resolves when the session is successfully deleted.
 */
exports.deleteSession = async (userId) => {
    await redisClient.del(String(userId));
};

/**
 * Retrieves a session from Redis.
 *
 * @param {number|string} userId - The ID of the user associated with the session.
 * @returns {Promise<string|null>} A Promise that resolves with the session ID, or null if not found.
 */
exports.getSession = (userId) => {
    return redisClient.get(String(userId));
};

/**
 * The Redis client instance.
 */
exports.redisClient = redisClient;