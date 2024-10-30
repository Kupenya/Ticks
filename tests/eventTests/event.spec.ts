import chai from "chai";
import chaiHttp from "chai-http";
import db from "../../src/db";
import { UserRole } from "../../src/utils/enums/user.enum";

import SetUpTestDB from "../../src/db/seeders/set-up-test-db";
import { QueryInterface } from "sequelize";

chai.use(chaiHttp);
const { expect } = chai;

describe("Test suit for CRUD events User", async () => {
  const Testserver = "http://localhost:3002/";
  let accessToken: string;
  const eventRoute = "api/v1/event";
  const loginRoute = "api/v1/auth/login";
  let eventId: number;
  let queryInterface: QueryInterface;

  before(async () => {
    await db.connect();
    queryInterface = db.sequelize.getQueryInterface();
  });

  beforeEach(async () => {
    await SetUpTestDB.up(queryInterface);
    const res = await chai
      .request(Testserver)
      .post(loginRoute)
      .send({ email: "glo.phon@testmail.com", password: "Testing123!" });

    accessToken = res.body.data.accessToken;
    eventId = 5;
  });

  afterEach(async () => {
    await SetUpTestDB.down(queryInterface);
  });

  it("should create a new event with all required fields", async () => {
    const res = await chai
      .request(Testserver)
      .post(`${eventRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send({
        name: "Art Exhibition",
        date: new Date("2024-12-15"),
        totalTickets: 50,
        availableTickets: 50,
      });
    expect(res).to.have.status(201);
    expect(res.body.message).to.deep.equal("Event Created Successfully.");
  });

  it("should not create an event with a duplicate name", async () => {
    await chai
      .request(Testserver)
      .post(`${eventRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send({
        name: "Duplicate Event",
        date: new Date("2024-12-20"),
        totalTickets: 100,
        availableTickets: 100,
      });

    const res = await chai
      .request(Testserver)
      .post(`${eventRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send({
        name: "Duplicate Event",
        date: new Date("2024-12-21"),
        totalTickets: 100,
        availableTickets: 100,
      });

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal("Event name already exists.");
  });

  it("should retrieve an event by ID", async () => {
    const res = await chai
      .request(Testserver)
      .get(`${eventRoute}/${eventId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property("id", eventId);
  });

  it("should return a 404 error for a non-existent event", async () => {
    const nonExistentId = 999;
    const res = await chai
      .request(Testserver)
      .get(`${eventRoute}/${nonExistentId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("Event not found.");
  });

  it("should update an existing event", async () => {
    const res = await chai
      .request(Testserver)
      .put(`${eventRoute}/${eventId}`)
      .set({ authorization: `${accessToken}` })
      .send({
        name: "Updated Art Exhibition",
        date: new Date("2024-12-30"),
        totalTickets: 75,
        availableTickets: 75,
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal("Event Updated Successfully.");
  });

  it("should return an error when updating a non-existent event", async () => {
    const nonExistentId = 999;
    const res = await chai
      .request(Testserver)
      .put(`${eventRoute}/${nonExistentId}`)
      .set({ authorization: `${accessToken}` })
      .send({
        name: "Non-existent Event",
        date: new Date("2024-12-31"),
        totalTickets: 10,
        availableTickets: 10,
      });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("Event not found.");
  });

  it("should delete an event by ID", async () => {
    const res = await chai
      .request(Testserver)
      .delete(`${eventRoute}/${eventId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal("Event Deleted Successfully.");
  });

  it("should return an error when deleting a non-existent event", async () => {
    const nonExistentId = 999;
    const res = await chai
      .request(Testserver)
      .delete(`${eventRoute}/${nonExistentId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("Event not found.");
  });
});
