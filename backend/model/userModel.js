import mongoose from "mongoose";
import { db_link } from "../secrets.js";

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("user db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const userModel = mongoose.model("userModel", userSchema);
