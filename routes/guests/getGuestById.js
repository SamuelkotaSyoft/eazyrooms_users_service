import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import Guest from "../../models/guestModel.js";

const router = express.Router();

async function getGuestById(req, res) {
  const { guestId } = req.params;
  const uid = req.user_info.main_uid;
  const role = req.user_info.role;
  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    const guest = await Guest.findOne({ _id: guestId });
    res.status(200).json({ status: true, data: guest });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
}
router.get("/:guestId", verifyToken, getGuestById);
export default router;
