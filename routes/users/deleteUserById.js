import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

const router = express.Router();
//

//import models
import User from "../../models/userModel.js";

//new buyer
router.delete("/:userId", verifyToken, async function (req, res) {
  //request payload
  const userId = req.params.userId;

  //validate userId
  if (!userId) {
    res.status(400).json({ status: false, error: "userId is required" });
    return;
  }

  try {
    //check if user exists
    const user = User.findById(userId);
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }

    //delete user
    const writeResult = await User.deleteOne({ _id: userId });

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
