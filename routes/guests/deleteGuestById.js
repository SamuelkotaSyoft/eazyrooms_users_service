import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import { matchedData } from "express-validator";
import User from "../../models/userModel.js";
import Guest from "../../models/guestModel.js";
import { badRequestError } from "../../errors/badRequestError.js";
const router = express.Router();
async function deleteGuestById(req, res, next) {
  const { guestId } = req.params;
  const uid = req.user_info.main_uid;
  const role = req.user_info.role;
  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    const user = await User.findOne({ uid: uid });
    const guest = await Guest.findByIdAndUpdate(
      { _id: guestId },
      { status: false, updatedBy: user._id },
      { new: true }
    );
    res.status(200).json({ status: true, data: guest });
  } catch (err) {
    //
    badRequestError(err);
    // next({ status: 500, message: err });
    res.status(500).json({ staxtus: false, error: err });
  }
}
router.delete("/:guestId", verifyToken, deleteGuestById);
export default router;
