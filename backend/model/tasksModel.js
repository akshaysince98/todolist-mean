import mongoose from "mongoose";
import { db_link } from "../secrets.js";

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("todo db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const tasksSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description available",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  creatorMail :{
    type: String
  },
  imagePath: {
    type: String,
  },
});

export const tasksModel = mongoose.model("tasksModel", tasksSchema);
