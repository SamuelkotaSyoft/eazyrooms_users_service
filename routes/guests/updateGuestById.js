import express from "express";
import { matchedData } from "express-validator";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import verifyToken from "../../helpers/verifyToken.js";
import Guest from "../../models/guestModel.js";
import User from "../../models/userModel.js";
import { updateGuestValidationSchema } from "../../validationSchema/guests/updateGuestValidationSchema.js";

const router = express.Router();
async function updateGuestById(req, res, next) {
  const { guestId } = requestData;
  const requestData = matchedData(req);
  try {
    const guest = await Guest.findByIdAndUpdate(
      { uid: guestId },
      { ...requestData, updatedBy: user._id },
      { new: true }
    );

    res.status(200).json({ status: true, data: guest });
  } catch (err) {
    res.status(500).json({ error: err });
    // const data = badRequestError(err);
    // next(data);
  }
}
router.patch(
  "/",
  // verifyToken,
  updateGuestValidationSchema,
  validateRequest,
  updateGuestById
);
export default router;
