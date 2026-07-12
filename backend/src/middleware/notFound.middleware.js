import { ApiError } from "../utils/ApiError.js";
import { STATUS_CODES } from "../config/constants.js";

const notFoundHandler = (req, res, next) => {
  next(
    new ApiError(
      STATUS_CODES.NOT_FOUND,
      `Not Found - ${req.originalUrl}`
    )
  );
};

export { notFoundHandler };
