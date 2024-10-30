import chai from "chai";
import chaiHttp from "chai-http";
import db from "../../src/db";
import { UserRole } from "../../src/utils/enums/user.enum";

import SetUpTestDB from "../../src/db/seeders/set-up-test-db";
import { QueryInterface } from "sequelize";

chai.use(chaiHttp);
const { expect } = chai;

describe("Test suite for CRUD events User", async () => {
  const Testserver = "http://localhost:3002/";
  let accessToken: string;
  const userRoute = "api/v1/user";
  const loginRoute = "api/v1/auth/login";
  let userId: number;
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
    userId = 1;
  });

  afterEach(async () => {
    await SetUpTestDB.down(queryInterface);
  });

  it("should create a new user with all required fields", async () => {
    const res = await chai
      .request(Testserver)
      .post(`${userRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@testmail.com",
        password: "Password123!",
        role: UserRole.user,
      });
    expect(res).to.have.status(201);
    expect(res.body.message).to.deep.equal("User Created Successfully.");
  });

  it("should not create a user with a duplicate email", async () => {
    await chai
      .request(Testserver)
      .post(`${userRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@testmail.com",
        password: "Password123!",
        role: UserRole.user,
      });

    const res = await chai
      .request(Testserver)
      .post(`${userRoute}/`)
      .set({ authorization: `${accessToken}` })
      .send({
        firstName: "Duplicate",
        lastName: "User",
        email: "jane.smith@testmail.com",
        password: "Password123!",
        role: UserRole.user,
      });

    expect(res).to.have.status(400);
    expect(res.body.message).to.deep.equal("Email already exists.");
  });

  it("should retrieve a user by ID", async () => {
    const res = await chai
      .request(Testserver)
      .get(`${userRoute}/${userId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property("id", userId);
  });

  it("should return a 404 error for a non-existent user", async () => {
    const nonExistentId = 999;
    const res = await chai
      .request(Testserver)
      .get(`${userRoute}/${nonExistentId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("User not found.");
  });

  it("should update an existing user", async () => {
    const res = await chai
      .request(Testserver)
      .put(`${userRoute}/${userId}`)
      .set({ authorization: `${accessToken}` })
      .send({
        firstName: "Updated",
        lastName: "Name",
        email: "updated.email@testmail.com",
        password: "UpdatedPassword123!",
        role: UserRole.admin,
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal("User Updated Successfully.");
  });

  it("should return an error when updating a non-existent user", async () => {
    const nonExistentId = 999;
    const res = await chai
      .request(Testserver)
      .put(`${userRoute}/${nonExistentId}`)
      .set({ authorization: `${accessToken}` })
      .send({
        firstName: "Non-existent",
        lastName: "User",
        email: "nonexistent.user@testmail.com",
        password: "Password123!",
        role: UserRole.user,
      });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("User not found.");
  });

  it("should delete a user by ID", async () => {
    const res = await chai
      .request(Testserver)
      .delete(`${userRoute}/${userId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(200);
    expect(res.body.message).to.deep.equal("User Deleted Successfully.");
  });

  it("should return an error when deleting a non-existent user", async () => {
    const nonExistentId = 999;
    const res = await chai
      .request(Testserver)
      .delete(`${userRoute}/${nonExistentId}`)
      .set({ authorization: `${accessToken}` });

    expect(res).to.have.status(404);
    expect(res.body.message).to.deep.equal("User not found.");
  });
});
