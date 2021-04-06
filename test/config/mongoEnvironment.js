const { MongoClient } = require("mongodb");
const NodeEnvironment = require("jest-environment-node");

class MongoEnvironment extends NodeEnvironment {
  async setup() {
    try {
      this.global.zooClient = await MongoClient.connect(
        process.env.ZOO_DB_URI,
        {
          useUnifiedTopology: true,
        }
      );
    } catch (e) {
      console.log(e);
    }
    await super.setup();
  }

  async teardown() {
    this.global.zooClient.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;
