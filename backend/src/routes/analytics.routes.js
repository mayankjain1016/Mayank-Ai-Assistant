import { Router } from "express";
import { 
  getConversationsList, 
  getConversationDetail, 
  getDailyTrends, 
  getErrorLogs, 
  getAiFailureRate, 
  getLanguageBreakdown 
} from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// All analytics endpoints are protected by admin auth
router.use(authenticate);

// Part A: Conversations List
router.get("/conversations", getConversationsList);

// Part B: Single Conversation Detail (must come after static routes)
router.get("/conversations/:conversationId", getConversationDetail);

// Part C: Daily Trends
router.get("/trends", getDailyTrends);

// Part D: Errors
router.get("/errors", getErrorLogs);

// Part E: AI Failure Rate and Language Breakdown
router.get("/failure-rate", getAiFailureRate);
router.get("/language-breakdown", getLanguageBreakdown);

export default router;
