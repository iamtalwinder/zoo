const UserDAO = require("../dao/userDAO");

const testUser = {
  name: "Test",
  email: "test@test.com",
  password: "test",
};

describe("UserDAO", () => {
  beforeAll(async () => {
    await UserDAO.injectDB(global.zooClient);
  });

  afterAll(async () => {
    await UserDAO.deleteUser(testUser.email);
  });

  test("Can add a new user to the database", async () => {
    const actual = await UserDAO.addUser(testUser);
    expect(actual.success).toBeTruthy();
    expect(actual.error).toBeUndefined();

    const user = await UserDAO.getUser(testUser.email);

    delete user._id;
    expect(user).toEqual(testUser);
  });
});
