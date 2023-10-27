import STATUS_CODES from "../constants/statusCodes.js";

const notFoundError = (error) => {
  if (typeof error === "string") {
    return {
      status: STATUS_CODES.NOT_FOUND,
      error: { status: false, error: [{ msg: error }] },
    };
  } else if (typeof error === "object") {
    if (error.error) {
      return {
        status: STATUS_CODES.NOT_FOUND,
        error: { status: false, error: [{ msg: error.error }] },
      };
    } else {
      return {
        status: STATUS_CODES.NOT_FOUND,
        error: { status: false, error: [{ msg: "An unknown Error Occoured" }] },
      };
    }
  }
};

export { notFoundError };
