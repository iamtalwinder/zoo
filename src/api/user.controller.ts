import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserDAO from "../dao/userDAO";
import * as userTypes from "../types/user";

export class User {
  name: string;
  email: string;
  password: string;

  constructor({ name, email, password }: userTypes.userInfo) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  info() {
    return {
      name: this.name,
      email: this.email,
    };
  }

  async comparePassword(plainText: string) {
    return await bcrypt.compare(plainText, this.password);
  }

  encoded() {
    return jwt.sign(
      {
        ...this.info(),
      },
      process.env.TOKEN_SECRET as string
    );
  }
}

export default class UsersController {
  static async register(req: express.Request, res: express.Response) {
    try {
      const userFromBody = req.body;

      const userInfo = {
        ...userFromBody,
        password: await bcrypt.hash(userFromBody.password, 10),
      };

      const insertResult = await UserDAO.addUser(userInfo);

      if (
        String(insertResult.error).startsWith(
          "MongoError: E11000 duplicate key error"
        )
      ) {
        res.status(409).send({
          field: "email",
          msg: "A user with the given email already exists.",
        });
        return;
      }

      const userFromDB = await UserDAO.getUser(userFromBody.email);

      if (!userFromDB) throw Error("Database error");

      const user = new User(userFromDB);

      res.status(201).send({
        authToken: user.encoded(),
        info: user.info(),
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({ msg: "Internal server error" });
    }
  }

  static async login(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body;

      let userData = await UserDAO.getUser(email);

      if (!userData) {
        res
          .status(406)
          .send({ field: "email", msg: "Make sure your email is correct." });
        return;
      }

      const user = new User(userData);

      if (!(await user.comparePassword(password))) {
        res.status(406).send({
          field: "password",
          msg: "Make sure your password is correct.",
        });
        return;
      }

      res.status(200).send({ authToken: user.encoded(), info: user.info() });
    } catch (e) {
      res.status(400).send({ msg: "Internal server error" });
      return;
    }
  }
}
