import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import { doc, deleteDoc } from "firebase/firestore";
import * as auth from "@firebase/auth";
import * as fs from "firebase-admin/firestore";
import admin from "firebase-admin";

//import models
import User from "../../models/userModel.js";
import * as app from "@firebase/app";
import { getAuth, deleteUser } from "firebase/auth";
import { authentication } from "../../config/firebase-config.js";
const router = express.Router();

router.delete("/:roleId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //request payload
  const role = req.params.roleId;
  //validate role
  if (!role) {
    res.status(400).json({ status: false, error: "role is required" });
    return;
  }

  try {
    //check if user exists
    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }
    const staff = await User.findOne({ _id: role });
    const fb = fs.getFirestore();

    await fb.collection("userAuth").doc(staff.uid).delete();

    const deleteUser = async (uid) => {
      try {
        await admin.auth().deleteUser(uid);

      } catch (error) {
      }
    };

    deleteUser(staff.uid);

    //delete role
    const writeResult = await User.deleteOne({ _id: role });

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
