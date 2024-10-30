"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("bookings", [
      {
        eventId: 1,
        userId: 2,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        ticketsReserved: 2,
        bookingStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 1,
        userId: 3,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        ticketsReserved: 3,
        bookingStatus: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: null,
        firstName: "Alice",
        lastName: "Smith",
        email: "alice.smith@example.com",
        ticketsReserved: 1,
        bookingStatus: "waitlisted",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("bookings", null, {});
  },
};
