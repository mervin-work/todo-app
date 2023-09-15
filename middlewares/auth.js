'use strict';

const jwtUtil = require('../utils/jwt');
const redis = require('../utils/redis');
const httpConstants = require('http2').constants;
/**
 * Middleware to authenticate the user based on the JWT token in the Authorization header.
 * It verifies the token, checks if it's valid, and sets the user ID in the request object.
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The response object or calls the next middleware
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Missing authorization token' });
    }

    // Decode the JWT token to get the user ID
    const userId = jwtUtil.decodeAccessToken(authHeader, process.env.JWT_KEY);

    // Check if the token is valid and the user session exists in Redis
    if (!userId || !(await redis.getSession(userId))) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token' });
    }

    req.userId = userId;  // Set the user ID in the req object

    next(); // Call the next middleware or route handler
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid authorization token' });
  }
};

module.exports = authenticateUser;