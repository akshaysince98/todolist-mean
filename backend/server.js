import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { tasksRouter } from "./Routers/tasksRouter.js";
import { userRouter } from "./Routers/userRouter.js";
import bodyParser from "body-parser";


const server = express();

const port = process.env.PORT || 3000;

server.use("/uploadedImages", express.static("E:/CODING/MOGI Tut/todolist-mean/backend/uploadedImages"));

server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

server.use(cookieParser());

server.use(express.json());
server.use(cors());

server.listen(port);

server.use("/api/tasks", tasksRouter);
server.use("/auth/user", userRouter);
