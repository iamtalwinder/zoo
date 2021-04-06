import { Router } from "express";
import UserController from "./user.controller";
import { validator } from "./middleware";
import { registerSchema, loginSchema } from "./user.controller.schema";

const router: any = new Router();

router.post("/register", validator(registerSchema), UserController.register);
router.post("/login", validator(loginSchema), UserController.login);

export default router;
