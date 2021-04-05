let users: any;

export default class userDAO {
  static async injectDB(conn: any) {
    if (users) return;

    try {
      users = await conn.db(process.env.ZOO_NS).collection("users");
    } catch (e: any) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }
}
