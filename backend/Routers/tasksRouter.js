import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controller/tasksController.js";
import multer from "multer";
import path from "path";
import { checkAuth } from "../middlewares/checkAuth.js";

export const tasksRouter = express.Router();

// MULTER function
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "E:/CODING/MOGI Tut/todolist-mean/backend/uploadedImages");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + fileName);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

tasksRouter.route("/").get(getTasks);

// upload.single("image")

tasksRouter
  .route("/create")
  .post(upload.single("image"), checkAuth, createTask);

tasksRouter
  .route("/:id")
  .patch(upload.single("image"), checkAuth, updateTask)
  .post(checkAuth, getTask);
tasksRouter.route("/delete/:id").post(checkAuth, deleteTask);
