import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

const router = express.Router();

//import models
import User from "../../models/userModel.js";

//get all chatbots
router.get("/:locationId", verifyToken, async function (req, res) {
  try {
    const uid = req.user_info.main_uid;
    const role = req.user_info.role;
    const locationId = req.params.locationId;
    // console.log("UID >>>", uid);

    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "unauthorized" });
      return;
    }

    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, message: "User not found" });
      return;
    }

    //query
    let query = User.find({ location: { $in: [locationId] } }).populate(
      "rooms floors stores blocks"
    );

    //execute query
    const queryResult = await query.exec();
    // console.log({ queryResult });
    // console.log("user cred details------", queryResult);

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(404).json({ status: false, error: err });
  }
});

export default router;
