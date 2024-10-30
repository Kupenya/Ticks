"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("events", [
      {
        name: "Concert",
        date: new Date("2024-12-01"),
        totalTickets: 100,
        availableTickets: 100,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Art Exhibition",
        date: new Date("2024-12-15"),
        totalTickets: 50,
        availableTickets: 50,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("events", null, {});
  },
};
