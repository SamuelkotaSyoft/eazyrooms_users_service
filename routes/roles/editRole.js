import express, { request } from "express";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import verifyToken from "../../helpers/verifyToken.js";
import { editRoleValidationSchema } from "../../validationSchema/role/editRoleValidationSchema.js";
import { matchedData } from "express-validator";
import userModel from "../../models/userModel.js";
const router = express.Router();

async function editRole(req, res) {
  const uid = req.user_info.main_uid;
  const role = req.user_info.role;
  const user = userModel.findOne({ uid: uid });
  if (!user) {
    res.status(400).json({ status: false, error: "Invalid userId" });
    return;
  }

  const requestData = matchedData(req);
  const initialData = await userModel.findOne({ _id: requestData.staffId });

  if (initialData?.role !== requestData?.role) {
    console.log(requestData?.role);
    if (requestData?.role === "locationAdmin") {
      requestData.stores = null;
      requestData.floors = null;
      requestData.rooms = null;
      requestData.blocks = null;
    }
    if (requestData?.role === "storeAdmin") {
      requestData.floors = null;
      requestData.rooms = null;
      requestData.blocks = null;
    }
  }

  const staff = await userModel.findByIdAndUpdate(
    { _id: requestData.staffId },
    { ...requestData, updatedBy: user._id },
    { new: true }
  );
  res.status(200).json({
    status: true,
    data: staff,
  });
}

router.patch(
  "/",
  verifyToken,
  editRoleValidationSchema,
  validateRequest,
  editRole
);
export default router;
