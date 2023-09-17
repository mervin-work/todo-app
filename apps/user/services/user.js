'use strict';
const models = require('../../../models');
/**
 * User Services
*/

/**
 * Find User by its username
 * @param {string} username - Username of the user
 * @returns {Promise<Object>} - A Promise that resolves to the user object.
 */
const findUserByUsername = async(username) => {
    const user = await models.User.findOne({
        where: {
            username: username
        }
    });

    if(!user) throw new Error("User not found");

    return user;
}

// const

module.exports = {
    findUserByUsername
};
