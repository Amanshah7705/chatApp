import { Router } from "express";
import {
  emailVerify,
  loginUser,
  registerUser,
} from "../controllers/auth.controllers";

const authRouter = Router();

//@ts-ignore
authRouter.route("/register").post(registerUser);
//@ts-ignore
authRouter.route("/login").post(loginUser);
//@ts-ignore
authRouter.route("/emailVerify").post(emailVerify);
export default authRouter;
