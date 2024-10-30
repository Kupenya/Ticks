"use strict";
import bcrypt from "bcryptjs";
import { QueryInterface } from "sequelize";
import { UserRole } from "../../utils/enums/user.enum";

class SetUpTestDB {
  /** @type {import('sequelize-cli').Migration} */

  async up(queryInterface: QueryInterface) {
    const passwordHash = await bcrypt.hash("Testing123!", 10);

    // Insert Users
    await queryInterface.bulkInsert("users", [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.de@example.com",
        password: passwordHash,
        role: UserRole.admin,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.de@example.com",
        password: passwordHash,
        role: UserRole.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Alice",
        lastName: "Smart",
        email: "alice.smat@example.com",
        password: passwordHash,
        role: UserRole.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Unauthenticated",
        lastName: "User",
        email: "unauthenticated@example.com",
        password: passwordHash,
        role: UserRole.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert Events
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

    // Insert Bookings
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
        bookingStatus: "canceled",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("bookings", null, {});
    await queryInterface.bulkDelete("events", null, {});
    await queryInterface.bulkDelete("users", null, {});
  }
}

export default new SetUpTestDB();
