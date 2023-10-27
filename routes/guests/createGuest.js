import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import { matchedData } from "express-validator";
import Guest from "../../models/guestModel.js";
import User from "../../models/userModel.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import { uploadImageToS3 } from "../../helpers/uploads/uploadImageToS3.js";
import { createGuestValidationSchema } from "../../validationSchema/guests/creatGuestValidationSchema.js";
const router = express.Router();
const createGuest = async (req, res) => {
  const requestData = matchedData(req);
  const uid = req.user_info.main_uid;
  const role = req.user_info.role;
  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    const user = await User.find({ uid });
    const guest = new Guest({
      image: req.fileUrl,
      ...requestData,
      createdBy: user._id,
      updatedBy: user._id,
      status: true,
    });
    const writableResult = await guest.save();
    res.status(200).json({ status: true, data: writableResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
router.post(
  "/",
  verifyToken,
  uploadImageToS3,
  createGuestValidationSchema,
  validateRequest,
  createGuest
);
export default router;
