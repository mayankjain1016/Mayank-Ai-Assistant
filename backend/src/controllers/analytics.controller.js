import { analyticsService } from "../services/analytics.service.js";
import { errorLogService } from "../services/errorLog.service.js";
import { dashboardStatsService } from "../services/dashboardStats.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// GET /api/v1/analytics/conversations
export const getConversationsList = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const { startDate, endDate } = req.query;

  const result = await analyticsService.getConversationsList({ page, limit, startDate, endDate });
  res.status(200).json(new ApiResponse(200, result, "Conversations retrieved successfully"));
});

// GET /api/v1/analytics/conversations/:conversationId
export const getConversationDetail = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const result = await analyticsService.getConversationDetail(conversationId);
  
  if (!result) {
    throw new ApiError(404, "Conversation not found");
  }

  res.status(200).json(new ApiResponse(200, result, "Conversation detail retrieved successfully"));
});

// GET /api/v1/analytics/trends
export const getDailyTrends = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const result = await analyticsService.getDailyTrends({ days });
  res.status(200).json(new ApiResponse(200, result, "Daily trends retrieved successfully"));
});

// GET /api/v1/analytics/errors
export const getErrorLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const { source } = req.query;

  const result = await errorLogService.getRecentErrorLogs({ page, limit, source });
  res.status(200).json(new ApiResponse(200, result, "Error logs retrieved successfully"));
});

// GET /api/v1/analytics/failure-rate
export const getAiFailureRate = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const result = await dashboardStatsService.getAiFailureRate({ startDate, endDate });
  res.status(200).json(new ApiResponse(200, result, "AI failure rate retrieved successfully"));
});

// GET /api/v1/analytics/language-breakdown
export const getLanguageBreakdown = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const result = await analyticsService.getLanguageBreakdown({ startDate, endDate });
  res.status(200).json(new ApiResponse(200, result, "Language breakdown retrieved successfully"));
});
