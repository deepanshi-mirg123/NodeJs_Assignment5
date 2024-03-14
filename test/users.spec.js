const request = require("supertest");
const app = require("../server"); // Assuming server.js is renamed to server.js and moved to src folder
const User = require("../model/userModel");

// Function to authenticate and get token
async function authenticateAndGetToken() {
  const userData = {
    name: "Depti",
    email: "depti@gmail.com",
    address: "Chennai",
    occupation: "ITHEAD",
    password: "depti@123",
  };

  // Registering a new user
  await request(app).post("/signup").send(userData);

  // Logging in with registered user credentials
  const response = await request(app).post("/login").send({
    email: userData.email,
    password: userData.password,
  });

  return response.body.data.x_access_token;
}


describe("User Routes", () => {
  let authToken; // To store the authentication token for future requests

  beforeAll(async () => {
    // Authenticate and get the token before running tests
    authToken = await authenticateAndGetToken();
  });

  it("should get details of all users", async () => {
    const response = await request(app)
      .get("/data")
      .set("x_access_token", `${authToken}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.users.length).toBeGreaterThan(0);
  });

  it("should get details of a specific user by ID", async () => {
    const users = await User.find();
    const userId = users[0]._id;

    const response = await request(app)
      .get(`/data/${userId}`)
      .set("x_access_token", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.user._id).toBe(userId.toString());
  });

  it("should update details of a specific user by ID", async () => {
    const users = await User.find();
    const userId = users[0]._id;

    const updatedData = {
      name: "UpdatedName",
      email: "updatedemail@gmail.com",
    };

    const response = await request(app)
      .patch(`/data/${userId}`)
      .set("x_access_token", `Bearer ${authToken}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.user.name).toBe(updatedData.name);
    expect(response.body.data.user.email).toBe(updatedData.email);
  });

  it("should delete a specific user by ID", async () => {
    const users = await User.find();
    const userId = users[0]._id;

    const response = await request(app)
      .delete(`/data/${userId}`)
      .set("x_access_token", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.message).toContain(userId.toString());
  });
});
