import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { STATUS_CODES } from "../config/constants.js";
import { dashboardStatsService } from "../services/dashboardStats.service.js";

class DashboardStatsController {
  getDashboardStats = asyncHandler(async (req, res) => {
    const periodDays = req.query.period ? parseInt(req.query.period, 10) : 7;
    
    const stats = await dashboardStatsService.getStats(periodDays);
    
    return res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, stats, "Dashboard stats fetched successfully"));
  });
}

export const dashboardStatsController = new DashboardStatsController();
