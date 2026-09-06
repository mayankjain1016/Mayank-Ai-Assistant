import validator from "validator";
import { ApiError } from "../utils/ApiError.js";
import { STATUS_CODES } from "../config/constants.js";

/**
 * Validates and sanitizes email and password for auth operations (like Seeding)
 */
export const validateAuthCredentials = (email, password) => {
  if (!email || typeof email !== "string") {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required");
  }

  const sanitizedEmail = validator.normalizeEmail(email.trim());
  if (!sanitizedEmail || !validator.isEmail(sanitizedEmail)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Valid email is required");
  }

  if (!password || typeof password !== "string") {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password is required");
  }

  if (!validator.isLength(password, { min: 8 })) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password must contain at least one number");
  }

  if (!/[\W_]/.test(password)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password must contain at least one special character");
  }

  // Sanitize password (escape HTML)
  const sanitizedPassword = validator.escape(password);

  return { email: sanitizedEmail, password: sanitizedPassword };
};

export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Valid email is required");
  }

  if (!password || validator.isEmpty(password)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password is required");
  }

  next();
};
