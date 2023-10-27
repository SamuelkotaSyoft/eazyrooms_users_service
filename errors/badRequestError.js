import STATUS_CODES from "../constants/statusCodes.js";

const badRequestError = (error) => {
  if (typeof error === "string") {
    return {
      status: STATUS_CODES.BAD_REQUEST,
      error: { status: false, error: [{ msg: error }] },
    };
  } else if (typeof error === "object") {
    if (error.error) {
      if (typeof error.error === "string")
        return {
          status: STATUS_CODES.BAD_REQUEST,
          error: { status: false, error: [{ msg: error.error }] },
        };
      else {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          error: {
            status: false,
            error: [{ msg: "An unknown Error Occoured" }],
          },
        };
      }
    }
  } else {
    return {
      status: STATUS_CODES.BAD_REQUEST,
      error: { status: false, error: [{ msg: "An unknown Error Occoured" }] },
    };
  }
};

export { badRequestError };
