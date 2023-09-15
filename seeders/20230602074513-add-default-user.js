'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      username: "user",
      password: "$2b$10$6Ko88XatHddtQ0DHXmRsruimWhGtQYQAqflnRB6C3rFTAilIdcj9q",
      firstname: "Vlad",
      lastname: "Impaler",
      createdAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
