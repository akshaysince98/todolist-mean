import express from "express";
import { signup, login } from "../controller/userController.js";

export const userRouter = express.Router();

userRouter.route("/signup").post(signup);

userRouter.route("/login").post(login);