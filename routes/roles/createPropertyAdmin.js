import express from "express";
import * as fs from "firebase-admin/firestore";
// import sendEmail from "../../helpers/emails/sendEmail.js";
import { strogPasswordRegex } from "../../helpers/regex.js";
import sendEmail from "../../helpers/emails/sendEmail.js";
import { getAuth } from "firebase-admin/auth";

import * as dotenv from "dotenv";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import * as path from "path";
import { authentication } from "../../config/firebase-config.js";

const router = express.Router();
const fb = fs.getFirestore();

//import models
import User from "../../models/userModel.js";

const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const createPropertyAdmin = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  const isStrogPassword = strogPasswordRegex.test(req.body.password);
  if (!isStrogPassword) {
    return res.status(400).json({
      status: false,
      err: [{ msg: "Password is not strong enough" }],
    });
  }

  try {
    const resp = await new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(authentication, email, password)
        .then(resolve)
        .catch(reject);
    });

    //send email verification
    // await sendEmailVerification(resp.user);

    // const actionCodeSettings = {
    //   url: "https://staging.eazyrooms.com", // URL you want to be redirected to after email verification
    // };

    // send custom email verification template
    const link = await getAuth().generateEmailVerificationLink(email);
    console.log("Email verification link sent to ", email, link);

    try {
      await sendEmail({
        email: email,
        subject: "Verify your email address",
        templateName: "emailVerifyTemplate",
        variables: {
          link: link,
        },
        authToken: req.headers["eazyrooms-token"],
      });
    } catch (error) {
      console.log("Error in sending verify email", error);
    }

    // // send welcome email
    // try {
    //   await sendEmail({
    //     email: email,
    //     subject: "Welcome to Eazyrooms!",
    //     templateName: "adminWelcomeTemplate",
    //     variables: {
    //       fullName: name,
    //       role: "propertyAdmin",
    //       email: email,
    //       password: password,
    //     },
    //     authToken: req.headers["eazyrooms-token"],
    //   });
    // } catch (error) {
    //   console.log("Error sending welcome email to ", email);
    // }

    var uid = resp.user.uid;
    var role = "propertyAdmin";
    await fb.collection("userAuth").doc(uid).set({
      main_uid: uid,
      phoneNumber: phoneNumber,
      role: role,
      username: email,
      name: name,
      email: email,
      image: null,
      status: true,
      active: true,
    });

    let user = new User({
      uid: uid,
      fullName: name,
      emailAddress: email,
      phoneNumber: phoneNumber,
      role: "propertyAdmin",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: null,
      updatedBy: null,
    });

    await user.save();

    //send response to client
    res.status(200).json({
      message: "success",
      status: true,
    });
  } catch (err) {
    res.status(200).json({
      status: false,
      error: err,
    });
  }
};

router.post("/", createPropertyAdmin);

export default router;
