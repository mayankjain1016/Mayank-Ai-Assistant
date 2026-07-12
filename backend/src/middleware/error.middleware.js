import { ENV } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../config/logger.js";
import { STATUS_CODES } from "../config/constants.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Error
        ? STATUS_CODES.BAD_REQUEST
        : STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(ENV.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  logger.error(
    `${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
