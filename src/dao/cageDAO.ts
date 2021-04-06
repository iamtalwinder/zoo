import * as cageTypes from "../types/cage";

let cage: any;

export default class userDAO {
  static async injectDB(conn: any) {
    if (cage) return;

    try {
      cage = await conn.db(process.env.ZOO_NS).collection("cage");
    } catch (e: any) {
      console.error(`Unable to establish collection handles in cageDAO: ${e}`);
    }
  }

  static async insert(cageData: cageTypes.cage) {
    try {
      await cage.insertOne(cageData);

      return { success: true };
    } catch (e) {
      console.error(`Error occurred while adding new cage, ${e}.`);
      return { error: e };
    }
  }

  static async consumption(cageNumber: number) {
    try {
      const result = await cage.aggregate([
        { $match: { cageNumber: cageNumber } },
      ]);
    } catch (err) {}
  }
}
