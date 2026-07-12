import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { STATUS_CODES, APP_NAME } from "../config/constants.js";
import { ENV } from "../config/env.js";
import packageJson from "../../package.json" assert { type: "json" };

const checkHealth = asyncHandler(async (req, res) => {
  const healthData = {
    application: APP_NAME,
    status: "Running",
    environment: ENV.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: packageJson.version,
  };

  return res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, healthData, "Service is healthy"));
});

export { checkHealth };
