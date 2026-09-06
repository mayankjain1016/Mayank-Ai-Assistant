import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { STATUS_CODES } from "../config/constants.js";
import { authService } from "../services/auth.service.js";
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.loginUser(email, password);
  return res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, data, "User logged in successfully")
  );
});

export const logout = asyncHandler(async (req, res) => {
  // Extract token from header to blacklist
  let token = "";
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  await authService.logoutUser(token);
  return res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, null, "User logged out successfully")
  );
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, req.user, "Current user fetched successfully")
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  return res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, tokens, "Tokens refreshed successfully")
  );
});
