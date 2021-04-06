import express from "express";
import cors from "cors";
import user from "./api/user.route";
const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", user);

app.use("*", (req: express.Request, res: express.Response) =>
  res.status(404).send({ error: "not found" })
);

export default app;
