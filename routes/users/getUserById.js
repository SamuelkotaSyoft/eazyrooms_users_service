import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();

//import models
import User from "../../models/userModel.js";

//get user by id
router.get("/:userId", verifyToken, async function (req, res) {
  //payload
  const userId = req.auth.userId;

  //validate userId
  if (!userId) {
    return res.status(400).json({ status: false, error: "userId is required" });
  }

  try {
    //query
    let query = User.findOne({ _id: userId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
