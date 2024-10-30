import chai from "chai";
import chaiHttp from "chai-http";
import db from "../../src/db";
import { BookingStatus } from "../../src/utils/enums/booking.enum";
import {
  CreateBookingData,
  BookingCancellationData,
} from "../../src/interfaces/booking.interface";

import SetUpTestDB from "../../src/db/seeders/set-up-test-db";
import { QueryInterface } from "sequelize";

chai.use(chaiHttp);
const { expect } = chai;

describe("Test Suite for Booking Functionality", () => {
  const Testserver = "http://localhost:3002/";
  const bookingRoute = "api/v1/booking";
  let accessToken: string;
  let queryInterface: QueryInterface;

  before(async () => {
    await db.connect();
    queryInterface = db.sequelize.getQueryInterface();
  });

  beforeEach(async () => {
    await SetUpTestDB.up(queryInterface);
    const res = await chai
      .request(Testserver)
      .post("api/v1/auth/login")
      .send({ email: "glo.phon@testmail.com", password: "Testing123!" });

    accessToken = res.body.data.accessToken;
  });

  afterEach(async () => {
    await SetUpTestDB.down(queryInterface);
  });

  it("should create a new booking with all required fields", async () => {
    const createBookingData: CreateBookingData = {
      eventId: 5,
      userId: null,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      ticketsReserved: 2,
      bookingStatus: BookingStatus.Completed,
    };

    const res = await chai
      .request(Testserver)
      .post(`${bookingRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send(createBookingData);

    expect(res).to.have.status(201);
    expect(res.body.message).to.deep.equal("Booking Created Successfully.");
    expect(res.body.data).to.include({
      firstName: createBookingData.firstName,
      lastName: createBookingData.lastName,
      email: createBookingData.email,
      ticketsReserved: createBookingData.ticketsReserved,
      bookingStatus: createBookingData.bookingStatus,
    });
  });

  it("should not create a booking with insufficient tickets", async () => {
    const createBookingData: CreateBookingData = {
      eventId: 5,
      userId: null,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      ticketsReserved: 10,
      bookingStatus: BookingStatus.Pending,
    };

    const res = await chai
      .request(Testserver)
      .post(`${bookingRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send(createBookingData);

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal("Insufficient tickets available.");
  });

  it("should retrieve a booking by ID", async () => {
    const bookingId = 1;

    const res = await chai
      .request(Testserver)
      .get(`${bookingRoute}/${bookingId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property("id", bookingId);
  });

  it("should return a 404 error for a non-existent booking", async () => {
    const nonExistentId = 999;

    const res = await chai
      .request(Testserver)
      .get(`${bookingRoute}/${nonExistentId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("Booking not found.");
  });

  it("should cancel a booking", async () => {
    const cancellationData: BookingCancellationData = {
      bookingId: 1,
      ticketsToCancel: 1,
    };

    const res = await chai
      .request(Testserver)
      .post(`${bookingRoute}/cancel`)
      .set({ authorization: `${accessToken}` })
      .send(cancellationData);

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal("Booking cancelled successfully.");
  });

  it("should return an error when cancelling a non-existent booking", async () => {
    const cancellationData: BookingCancellationData = {
      bookingId: 999,
      ticketsToCancel: 1,
    };

    const res = await chai
      .request(Testserver)
      .post(`${bookingRoute}/cancel`)
      .set({ authorization: `${accessToken}` })
      .send(cancellationData);

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("Booking not found.");
  });
});
