'use strict';

const models = require("../../../models");

/**
Retrieves a user from the database based on the username.
@param {string} username - The username of the user to retrieve.
@returns {Promise<User>} A Promise that resolves to the user object if found.
@throws {Error} If the user with the specified username is not found.
*/
exports.getUserByUsername = async (username) => {
    const user = await models.User.findOne({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}