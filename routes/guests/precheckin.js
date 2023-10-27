import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import { matchedData } from "express-validator";
import User from "../../models/userModel.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import Guest from "../../models/guestModel.js";
import Booking from "../../models/bookingModel.js";
import { badRequestError } from "../../errors/badRequestError.js";
import { updateGuestValidationSchema } from "../../validationSchema/guests/updateGuestValidationSchema.js";
const router = express.Router();
async function updateGuestByUid(req, res, next) {
  const uid = req.user_info.main_uid;
  const requestData = matchedData(req);

  try {
    const guest = await Guest.findOne({ uid: uid });
    const booking = await Booking.findOne({ _id: requestData.bookingId });

    if (!booking) {
      res.status(400).json({ status: false, error: "Invalid booking" });
      return;
    }

    const updateBookingResult = await Booking.findByIdAndUpdate(
      {
        _id: requestData.bookingId,
      },
      { bookingStatus: "checkedIn" },
      { new: true }
    );
    const updateResult = await Guest.findByIdAndUpdate(
      { _id: guest._id },
      { ...requestData, updatedBy: guest._id },
      { new: true }
    );
    res.status(200).json({ status: true, data: updateResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
router.post(
  "/:bookingId",
  verifyToken,
  updateGuestValidationSchema,
  validateRequest,
  updateGuestByUid
);
export default router;
