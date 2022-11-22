import { tasksModel } from "../model/tasksModel.js";
import { jwtkey } from "../secrets.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { userModel } from "../model/userModel.js";

export async function getTasks(req, res) {
  try {
    // console.log(req.query);
    const pageSize = req.query.pagesize;
    const currentPage = req.query.currentpage;
    const token = req.query.token;


    let decodedToken = jwt.verify(token, jwtkey);
    console.log(decodedToken.uid);

    let numOfData = await tasksModel.countDocuments({
      creator: decodedToken.uid,
    });
    console.log(numOfData);

    let allTasks = await tasksModel
      .find({ creator: decodedToken.uid })
      .skip(pageSize * currentPage)
      .limit(pageSize);

    if (allTasks) {
      res.json({
        message: "All user data",
        data: allTasks,
        num: numOfData,
      });
    } else {
      res.json({
        message: "Data not found",
      });
    }
  } catch (err) {
    res.status(404).json({
      message: err.message + " catch",
    });
  }
}

export async function getTask(req, res) {
  try {
    let id = req.params.id;

    let task = await tasksModel.findById(id);

    let taskCreatorId = task.creator;
    if (taskCreatorId != req.userUid.uid) {
      res.status(401).json({
        message: "Not authorized to change this",
      });
      return;
    }

    if (task) {
      res.json({
        message: "Data found",
        data: task,
      });
    } else {
      res.json({
        message: "Data not found",
      });
    }
  } catch (err) {}
}

export async function createTask(req, res) {
  // console.log(req.file)
  try {
    let taskObj = req.body;
    console.log(taskObj);

    let url = req.protocol + "://" + req.get("host");

    let creatorData = await userModel.findById(req.userUid.uid);
    let creatorMail = creatorData.email;

    let newTask = await tasksModel.create({
      ...taskObj,
      creator: req.userUid.uid,
      creatorMail,
      imagePath: url + "/uploadedImages/" + req.file.filename,
    });
    if (newTask) {
      res.json({
        message: "New post created",
        data: { ...newTask },
      });
    } else {
      res.json({
        message: "post not created",
      });
    }
  } catch (err) {
    res.json({
      message: err,
    });
  }
}

export async function updateTask(req, res) {
  try {
    let id = req.params.id;
    let dataTbu = req.body;
    console.log(dataTbu);

    if (req.file != undefined) {
      let url = req.protocol + "://" + req.get("host");
      dataTbu = {
        ...dataTbu,
        imagePath: url + "/uploadedImages/" + req.file.filename,
      };
    }

    let updatedTask = await tasksModel.findByIdAndUpdate(id, dataTbu);

    if (updatedTask) {
      updatedTask = dataTbu;

      res.json({
        message: "Data updated",
        data: updatedTask,
      });
    } else {
      res.json({
        message: "Data not updated",
      });
    }
  } catch (err) {
    console.log("in update catch");
    res.json({
      message: err,
    });
  }
}

export async function deleteTask(req, res) {
  try {
    let id = req.params.id;

    let task = await tasksModel.findById(id);
    let taskCreatorId = task.creator;
    if (taskCreatorId != req.userUid.uid) {
      res.status(401).json({
        message: "Not authorized to change this",
      });
      return;
    }

    let deletedTask = await tasksModel.findByIdAndDelete(id);
    if (deletedTask) {
      res.json({
        message: "Data deleted",
        data: deletedTask,
      });
    } else {
      res.json({
        message: "Data not deleted",
      });
    }
  } catch (err) {
    res.json({
      message: err,
    });
  }
}
