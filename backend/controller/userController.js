import { userModel } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtkey, salt } from "../secrets.js";

export async function signup(req, res) {
  try {
    let userObj = req.body;

    bcrypt.genSalt(salt, async function (err, salt) {
      bcrypt.hash(userObj.password, salt, async function (err, hash) {
        userObj.password = hash;
        let user = await userModel.create(userObj);
        if (user) {
          let uid = user._id;
          let token = jwt.sign({ uid }, jwtkey, { expiresIn: "5h" });
          // res.cookie("login", token, { httpOnly: true });
          res.json({
            message: "user signed up",
            data: token,
          });
        } else {
          res.json({
            message: "error while signing up",
          });
        }
      });
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}

export async function login(req, res) {
  try {
    let userObj = req.body;
    let user = await userModel.findOne({ email: userObj.email });
    if (user) {
      let passcheck = await bcrypt.compare(userObj.password, user.password);
      if (passcheck) {
        let uid = user._id;
        let token = jwt.sign({ uid }, jwtkey);
        // res.cookie("login", token, { httpOnly: true });
        res.json({
          message: "user logged in",
          data: token,
        });
      } else {
        res.status(404).json({
          message: "Wrong password",
        });
      }
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
}
