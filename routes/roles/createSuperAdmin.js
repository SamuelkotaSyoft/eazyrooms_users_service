import express from "express";
import * as dotenv from "dotenv";
import * as fs from "firebase-admin/firestore";
import * as path from "path";
import * as uuid from "uuid";

import { authentication, getStorage } from "../../config/firebase-config.js";
import { getAuth } from "firebase-admin/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

const router = express.Router();
const fb = fs.getFirestore();

//import models
import User from "../../models/userModel.js";
import verifyToken from "../../helpers/verifyToken.js";
import { strogPasswordRegex } from "../../helpers/regex.js";

const createSuperAdmin = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  const isStrogPassword = strogPasswordRegex.test(password);
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

    var uid = resp.user.uid;
    var role = "superAdmin";
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

    //send response to client
    res.status(200).json({
      message: "Super Admin Registered Successfully",
      status: true,
    });
  } catch (err) {
    res.status(200).json({
      message: err.code,
    });
  }
};

router.post("/", createSuperAdmin);

export default router;
