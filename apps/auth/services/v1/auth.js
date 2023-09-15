'use strict';

/**
 * Auth Service
*/

const models = require('../../../../models');

const getUserByUsername = async(username) => {
    const user = await models.User.findOne({
        where: {
            username: username
        }
    });

    if(!user) throw new Error("User not found!");

    return user;
}

module.exports = {
    getUserByUsername
};