import { verifyAccessToken } from "../utils/jwt.util.js";
import { userRepository } from "../repositories/User.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUS_CODES } from "../config/constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken; // Future-proofing for cookie-based auth
  }

  if (!token) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Not authorized to access this route");
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded._id);
    if (!user) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "The user belonging to this token no longer exists");
    }

    if (!user.isActive) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, "User account is disabled");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Not authorized, token failed or expired");
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};
