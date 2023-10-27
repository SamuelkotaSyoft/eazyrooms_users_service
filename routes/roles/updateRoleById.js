import express from "express";
import { uploadImageToS3 } from "../../helpers/uploads/uploadImageToS3.js";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();
// import bcrypt from "bcrypt";


import User from "../../models/userModel.js";

//new buyer
router.patch("/", verifyToken, uploadImageToS3, async function (req, res) {
    //request payload
    // const userId = req.auth.userId;
    const uid = req.user_info.main_uid;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const locationId = req.body.locationId
    const userId = req.body.userId

    //validate userId
    if (!uid) {
        res.status(400).json({ status: false, error: "uid is required" });
        return;
    }

    try {
        //check if user exists
        const user = await User.findOne({ uid: uid });
        if (!user) {
            res.status(400).json({ status: false, error: "Invalid uid" });
            return;
        }

        //update user
        const writeResult = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    fullName: name,
                    emailAddress: email,
                    role: role,
                },
            },
            { new: true }
        );

        res.status(200).json({ status: true, data: writeResult });
    } catch (err) {
        console.log("error---------", err);
        res.status(404).json({ error: err });
    }
});

export default router;
