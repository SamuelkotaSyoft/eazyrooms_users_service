import { body, query, param } from "express-validator";

const updateGuestValidationSchema = [
  param("bookingId"),
  body("name").ltrim().rtrim().optional().notEmpty(),
  body("email").optional().isEmail(),
  body("phoneNumber").optional().isMobilePhone(),
  body("address").optional(),
  body("address.postCode")
    .isPostalCode("any")
    .optional()
    .withMessage("Invalid postal code"),
  body("property").optional(),
  body("location").optional(),
  body("active").optional().isBoolean(),
  body("status").optional().isBoolean(),
  body("isChild").optional(),
  body("age").optional().isNumeric(),
  body("kycDoc").optional().isArray(),
  body("gender")
    .optional()
    .matches(/^(male|female|other|preferNoToSay)$/)
    .toLowerCase(),
  body("guestId"),
];

export { updateGuestValidationSchema };
