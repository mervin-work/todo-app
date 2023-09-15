'use strict';

const bcrypt = require('bcrypt');
const configs = require('../constants/authentication');
const crypto = require('crypto');

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} A Promise that resolves to the hashed password.
 */
exports.hashPassword = (password) => bcrypt.hash(password, configs.salt_rounds);

/**
 * Compares a password with a hashed password using bcrypt.
 *
 * @param {string} password - The password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A Promise that resolves to true if the password matches the hashed password, false otherwise.
 */
exports.comparePasswords = (password, hashedPassword) => bcrypt.compare(password, hashedPassword)

/**
 * Generates a random session ID as a hex string with a specified length.
 *
 * @param {number} length - The length of the session ID string.
 * @returns {string} The generated session ID.
 */
exports.generateSessionId = (length) => {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('hex');
}