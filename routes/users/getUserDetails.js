import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import User from "../../models/userModel.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const userDetails = req.user_info;
  const authInfo = req.fb_info;
  const user = await User.findOne({ uid: req.user_info.main_uid }).populate(
    "property blocks floors rooms stores"
  );
  try {
    res.status(200).json({
      status: true,
      data: { ...userDetails, ...authInfo, ...user._doc },
    });
  } catch (error) {
    res.status(400).json({ status: false, data: error });
  }
});

export default router;
