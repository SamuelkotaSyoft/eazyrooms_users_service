import { body, query } from "express-validator";
import locationModel from "../../models/locationModel.js";

const createRoleValidationSchema = [
  body("stores")
    .optional({ values: [] | "" | null })
    .isArray(),
  body("rooms")
    .optional({ values: [] | "" | null })
    .isArray(),
  body("blocks")
    .optional({ values: [] | "" | null })
    .isArray(),
  body("floors")
    .optional({ values: [] | "" | null })
    .isArray(),
  body("location").custom(async (locationId) => {
    const isValidLocation = await locationModel.findOne({ _id: locationId });
    if (!isValidLocation) {
      throw new Error("Location is not valid");
    }
  }),
];

export { createRoleValidationSchema };
