import express from "express";
import { matchedData } from "express-validator";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import verifyToken from "../../helpers/verifyToken.js";
import Guest from "../../models/guestModel.js";
import { commonGetRequestValidationSchema } from "../../validationSchema/commonSchema.js";
const router = express.Router();
async function getAllGuests(req, res) {
  const requestData = matchedData(req);
  const { locationId } = req.params;
  const role = req.user_info.role;
  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    let filterObj = {};
    if (locationId) {
      filterObj.location = locationId;
    }

    var skip = (requestData.page - 1) * requestData.limit;
    //limit is the number of documents per page
    var limit = requestData.limit;
    var query = Guest.find(filterObj)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    const queryResult = await query.exec();
    //query to get the total number of guests
    //count the number of guests
    const bookingCount = await Guest.countDocuments(filterObj).exec();
    res.status(200).json({
      status: true,
      data: {
        guests: queryResult,
        page: Number(requestData.page),
        limit: limit,
        totalPageCount: Math.ceil(bookingCount / limit),
        totalCount: bookingCount,
      },
    });
    return;
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
}
router.get(
  "/:locationId",
  verifyToken,
  commonGetRequestValidationSchema,
  validateRequest,
  getAllGuests
);

export default router;
