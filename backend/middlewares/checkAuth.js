import jwt from "jsonwebtoken";
import { jwtkey } from "../secrets.js";

export function checkAuth(req, res, next) {
  
  try {
    let formdatastring = JSON.stringify(req.body)
    let formdata =  JSON.parse(formdatastring)
    req.body = {...formdata}
    let token;
    if (req.body) {
      token = req.body.token;
      let decodedUid = jwt.verify(token, jwtkey);
      if (decodedUid) {
        req.userUid = { uid: decodedUid.uid };
        next();
      } else {
        return res.status(401).json({
          message: "user not verified",
        });
      }
    } else {
      return res.json({
        message: "operation not allowed",
      });
    }
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
}
