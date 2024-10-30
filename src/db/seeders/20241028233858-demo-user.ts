"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "adminPassword",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: "userPassword",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Alice",
        lastName: "Smart",
        email: "alice.smart@example.com",
        password: "testPassword",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
