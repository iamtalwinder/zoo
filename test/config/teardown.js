module.exports = async () => {
  console.log("Teardown Mongo Connection");
  delete global.zooClient;
};
