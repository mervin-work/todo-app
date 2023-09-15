'use strict';
require('dotenv').config()
/** this config is for sequelize migration tool  */
module.exports = {
    development: {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres"
    },
    test: {
        use_env_variable: "DATABASE_TEST_URL",
        dialect: "mysql"
    },
    production: {
        use_env_variable: "DATABASE_URL",
        dialect: "mysql"
    }
};