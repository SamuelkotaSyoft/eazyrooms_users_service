import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

const router = express.Router();

//import models
import User from "../../models/userModel.js";
import { strogPasswordRegex } from "../../helpers/regex.js";
// import Store from "../../models/storeModel.js";

//create chatbot
router.post("/", verifyToken, async function (req, res) {
  const isStrogPassword = strogPasswordRegex.test(req.body.password);
  if (!isStrogPassword) {
    return res.status(400).json({
      status: false,
      err: [{ msg: "Password is not strong enough" }],
    });
  }

  //request payload
  const fullName = req.body.fullName;
  const emailAddress = req.body.emailAddress;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const property = req.body.property;
  const website = req.body.website;
  const pms = req.body.pms;
  const logoUrl = req.body.logoUrl;
  const currency = req.body.currency;

  try {
    //add address
    const user = new User({
      fullName: fullName,
      emailAddress: emailAddress,
      phoneNumber: phoneNumber,
      password: password,
      property: property,
      website: website,
      pms: pms,
      logoUrl: logoUrl,
      currency: currency,
    });

    //save address
    const writeResult = await user.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
