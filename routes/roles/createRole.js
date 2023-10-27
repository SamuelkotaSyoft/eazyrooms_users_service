import express from "express";
import * as dotenv from "dotenv";
import * as fs from "firebase-admin/firestore";
import * as path from "path";
import * as uuid from "uuid";
import { matchedData } from "express-validator";
import { authentication, getStorage } from "../../config/firebase-config.js";
import { getAuth } from "firebase-admin/auth";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import nodemailer from "nodemailer";
import sendEmail from "../../helpers/emails/sendEmail.js";

const router = express.Router();
const fb = fs.getFirestore();

//import models
import User from "../../models/userModel.js";
import verifyToken from "../../helpers/verifyToken.js";
import { createRoleValidationSchema } from "../../validationSchema/role/createRoleValidationSchema.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import { strogPasswordRegex } from "../../helpers/regex.js";

const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const createRole = async (req, res) => {
  var { name, email, password, role } = req.body;
  const isStrogPassword = strogPasswordRegex.test(password);
  if (!isStrogPassword) {
    return res.status(400).json({
      status: false,
      err: [{ msg: "Password is not strong enough" }],
    });
  }
  const requestData = matchedData(req);

  if (requestData.stores?.length === 0) {
    delete requestData.stores;
  }
  if (requestData.rooms?.length === 0) {
    delete requestData.rooms;
  }
  if (requestData.blocks?.length === 0) {
    delete requestData.blocks;
  }
  if (requestData.floors?.length === 0) {
    delete requestData.floors;
  }
  const adminUid = req.user_info.main_uid;

  const userDetails = req.user_info;

  if (userDetails.role === "propertyAdmin") {
    if (role === "locationAdmin") {
      role = "locationAdmin";
    } else if (role === "storeAdmin") {
      role = "storeAdmin";
    } else {
      role = "staff";
    }

    try {
      const adminUser = await User.findOne({ uid: adminUid });

      if (!adminUid) {
        res.status(400).json({
          status: false,
          message: "invalid user",
        });
        return;
      }

      createUserWithEmailAndPassword(authentication, email, password)
        .then(async (resp) => {
          var uid = resp.user.uid;

          await fb.collection("userAuth").doc(uid).set({
            main_uid: uid,
            phoneNumber: null,
            role: role,
            username: email,
            name: name,
            email: email,
            image: null,
            status: true,
            active: true,
          });

          //   SAVE TO MONGODB
          const user = new User({
            uid: uid,
            fullName: name,
            emailAddress: email,
            role: role,
            property: adminUser.property,
            // location: locationId,
            ...requestData,
          });

          const writeResult = await user.save();

          try {
            await sendEmail({
              email: email,
              subject: "Welcome to Eazyrooms!",
              templateName: "adminWelcomeTemplate",
              variables: {
                name: name,
                role: role,
                email: email,
                password: password,
              },
              authToken: req.headers["eazyrooms-token"],
            });
          } catch (error) {
            console.log("error sending email");
          }

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

          //send response to client
          res.status(200).json({
            status: true,
            data: writeResult,
            roleType: role,
            message: `${
              role
                .replace(/([A-Z])/g, " $1")
                .charAt(0)
                .toUpperCase() + role.replace(/([A-Z])/g, " $1").slice(1)
            } Created Successfully`,
          });
        })
        .catch(function (error) {
          var errorCode = error?.code;
          var errorMessage = error?.message;

          res.status(403).json({
            status: false,
            message: errorMessage,
            errorCode: errorCode,
          });
        });
    } catch (error) {
      res.status(200).json(error);
    }
  } else if (userDetails.role === "locationAdmin") {
    if (role === "storeAdmin") {
      role = "storeAdmin";
    } else {
      role = "staff";
    }

    try {
      const adminUser = await User.findOne({ uid: adminUid });

      if (!adminUid) {
        res.status(400).json({
          status: false,
          message: "invalid user",
        });
        return;
      }

      createUserWithEmailAndPassword(authentication, email, password)
        .then(async (resp) => {
          var uid = resp.user.uid;
          await fb.collection("userAuth").doc(uid).set({
            main_uid: uid,
            phoneNumber: null,
            role: role,
            username: email,
            name: name,
            email: email,
            image: null,
            status: true,
            active: true,
          });
          //   SAVE TO MONGODB
          const user = new User({
            uid: uid,
            fullName: name,
            emailAddress: email,
            role: role,
            property: adminUser.property,
            // location: locationId,
            ...requestData,
          });

          const writeResult = await user.save();

          try {
            await sendEmail({
              email: email,
              subject: "Welcome to Eazyrooms!",
              templateName: "adminWelcomeTemplate",
              variables: {
                name: name,
                role: role,
                email: email,
                password: password,
              },
              authToken: req.headers["eazyrooms-token"],
            });
          } catch (error) {
            console.log("error sending email");
          }

          // // send email verification
          // try {
          //   await sendEmailVerification(authentication.currentUser);
          // } catch (error) {
          //   console.log("error sending verification email");
          // }

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

          //send response to client
          res.status(200).json({
            status: true,
            data: writeResult,
            roleType: role,
            message: `${
              role
                .replace(/([A-Z])/g, " $1")
                .charAt(0)
                .toUpperCase() + role.replace(/([A-Z])/g, " $1").slice(1)
            } Created Successfully`,
          });
        })
        .catch(function (error) {
          var errorCode = error?.code;
          var errorMessage = error?.message;

          console.log(error);
          res.status(200).json({
            status: false,
            message: errorMessage,
            errorCode: errorCode,
          });
        });
    } catch (error) {
      res.status(200).json(error);
    }
  } else if (userDetails.role === "storeAdmin") {
    role = "staff";

    try {
      const adminUser = await User.findOne({ uid: adminUid });

      if (!adminUid) {
        res.status(400).json({
          status: false,
          message: "invalid user",
        });
        return;
      }

      createUserWithEmailAndPassword(authentication, email, password)
        .then(async (resp) => {
          var uid = resp.user.uid;
          await fb.collection("userAuth").doc(uid).set({
            main_uid: uid,
            phoneNumber: null,
            role: role,
            username: email,
            name: name,
            email: email,
            image: null,
            status: true,
            active: true,
          });

          //   SAVE TO MONGODB
          const user = new User({
            uid: uid,
            fullName: name,
            emailAddress: email,
            role: role,
            property: adminUser.property,
            // location: locationId,
            ...requestData,
          });

          const writeResult = await user.save();

          try {
            await sendEmail({
              email: email,
              subject: "Welcome to Eazyrooms!",
              templateName: "adminWelcomeTemplate",
              variables: {
                name: name,
                role: role,
                email: email,
                password: password,
              },
              authToken: req.headers["eazyrooms-token"],
            });
          } catch (error) {
            console.log("error sending email");
          }

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

          //send response to client
          res.status(200).json({
            status: true,
            data: writeResult,
            roleType: role,
            message: `${
              role
                .replace(/([A-Z])/g, " $1")
                .charAt(0)
                .toUpperCase() + role.replace(/([A-Z])/g, " $1").slice(1)
            } Created Successfully`,
          });
        })
        .catch(function (error) {
          var errorCode = error?.code;
          var errorMessage = error?.message;

          res.status(200).json({
            status: false,
            message: errorMessage,
            errorCode: errorCode,
          });
        });
    } catch (error) {
      res.status(200).json(error);
    }
  }
};

router.post(
  "/",
  verifyToken,
  createRoleValidationSchema,
  validateRequest,
  createRole
);

export default router;
