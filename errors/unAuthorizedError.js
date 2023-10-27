import STATUS_CODES from "../constants/statusCodes.js";

const unAuthorizedError = (error) => {
  if (typeof error === "string") {
    return {
      status: STATUS_CODES.UNAUTHORIZED,
      error: { status: false, error: [{ msg: error }] },
    };
  } else if (typeof error === "object") {
    if (error.error) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        error: { status: false, error: [{ msg: error.error }] },
      };
    } else {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        error: { status: false, error: [{ msg: "An unknown Error Occoured" }] },
      };
    }
  }
};

export { unAuthorizedError };
