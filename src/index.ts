import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import app from "./server";
import userDAO from "./dao/userDAO";

dotenv.config();

MongoClient.connect(process.env.ZOO_DB_URI as string, {
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await userDAO.injectDB(client);
    app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}`);
    });
  });
