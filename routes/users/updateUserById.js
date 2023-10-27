import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();
//

//import models
import User from "../../models/userModel.js";

//new buyer
router.patch("/", verifyToken, async function (req, res) {
  //request payload
  const userId = req.auth.userId;
  const fullName = req.body.fullName;
  const emailAddress = req.body.emailAddress;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const property = req.body.property;
  const website = req.body.website;
  const pms = req.body.pms;
  const logoUrl = req.body.logoUrl;
  const currency = req.body.currency;

  //validate userId
  if (!userId) {
    res.status(400).json({ status: false, error: "userId is required" });
    return;
  }

  try {
    //check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid userId" });
      return;
    }

    //update user
    const writeResult = await User.updateOne(
      { _id: userId },
      {
        $set: {
          fullName: fullName,
          emailAddress: emailAddress,
          phoneNumber: phoneNumber,
          password: password,
          property: property,
          website: website,
          pms: pms,
          logoUrl: logoUrl,
          currency: currency,
        },
      },
      { new: true }
    );

    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
