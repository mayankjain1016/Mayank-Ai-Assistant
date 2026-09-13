import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUS_CODES } from "../config/constants.js";
import { settingsService } from "../services/settings.service.js";

class SettingsController {
  getAiToggle = asyncHandler(async (req, res) => {
    const status = await settingsService.getAiToggleStatus();
    
    return res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, status, "AI toggle status fetched successfully"));
  });

  updateAiToggle = asyncHandler(async (req, res) => {
    const { aiEnabled } = req.body;
    
    if (typeof aiEnabled !== "boolean") {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "aiEnabled must be a boolean value");
    }

    const status = await settingsService.setAiToggleStatus(aiEnabled);
    
    return res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, status, "AI toggle status updated successfully"));
  });
}

export const settingsController = new SettingsController();
