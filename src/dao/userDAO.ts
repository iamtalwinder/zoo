import * as userTypes from "../types/user";
let user: any;

export default class userDAO {
  static async injectDB(conn: any) {
    if (user) return;

    try {
      user = await conn.db(process.env.ZOO_NS).collection("user");
    } catch (e: any) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  /**
   * Finds a user in the `user` collection
   * @param {string} email - The email of the desired user
   * @returns {Object | null} Returns either a single user or nothing
   */
  static async getUser(email: string) {
    return await user.findOne({ email: email });
  }

  /**
   * Adds a user to the `user` collection
   * @param {UserInfo} userInfo - The information of the user to add
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addUser(userInfo: userTypes.userInfo) {
    try {
      await user.insertOne({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
      });

      return { success: true };
    } catch (e) {
      console.error(`Error occurred while adding new user, ${e}.`);
      return { error: e };
    }
  }

  /**
   * Delete a user from the `user` collection
   * @param {string} email - The email of the user to delete
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async deleteUser(email: string) {
    try {
      await user.deleteOne({ email: email });

      if (!(await this.getUser(email))) {
        return { success: true };
      } else {
        console.error("Deletion unsuccessful");
        return { error: "Deletion unsuccessful" };
      }
    } catch (e) {
      console.error(`Error occured while deleting new user ${e}`);
      return { error: e };
    }
  }
}
