import { body, query } from "express-validator";

const createGuestValidationSchema = [
  body("name").ltrim().rtrim().notEmpty().withMessage("Name is required"),
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("phoneNumber").isMobilePhone().withMessage("Phone is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("address.postCode").isPostalCode("any").withMessage("Invalid post code"),
  body("property").notEmpty().withMessage("Property is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("isChild").optional(),
  body("age").optional().isNumeric(),
  body("kycDoc").optional().isArray(),
  body("gender")
    .notEmpty()
    .matches(/^(male|female|other|preferNoToSay)$/)
    .toLowerCase(),
];

export { createGuestValidationSchema };
