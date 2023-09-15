'use strict';

const jwt = require('jsonwebtoken');
const { DateTime } = require('luxon');
const config = require('../constants/authentication');

/**
 * Generates an access token for the specified user ID.
 *
 * @param {string} userId - The ID of the user for whom the access token is being generated.
 * @param {string} secretKey - The secret key used to sign the access token.
 * @returns {string} The generated access token.
 */
exports.createAccessToken = (userId, secretKey) => {
  // Set the expiration time of the token to 1 hour from the current time
  const expirationTime = DateTime.local().plus({ second: config.session_max_age }).toJSDate();

  // Create the payload of the token
  const payload = {
    user_id: userId,
    exp: Math.floor(expirationTime.getTime() / 1000), // Convert to seconds
  };

  // Encode the token using the secret key
  return jwt.sign(payload, secretKey, { algorithm: 'HS256' });
}

/**
 * Decodes and verifies an access token, extracting the user ID from it.
 *
 * @param {string} token - The access token to decode and verify.
 * @param {string} secretKey - The secret key used to sign the access token.
 * @returns {string | null} The ID of the user extracted from the access token, or null if the token is invalid or expired.
 */
exports.decodeAccessToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    const currentTime = Math.floor(DateTime.local().toJSDate().getTime() / 1000); // Convert to seconds

    if (decoded.exp < currentTime) {
      throw new Error('Token expired');
    }

    return decoded.user_id;
  } catch {
    return null;
  }
}