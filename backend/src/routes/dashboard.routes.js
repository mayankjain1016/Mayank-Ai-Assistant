import { Router } from "express";
import { dashboardStatsController } from "../controllers/dashboardStats.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Protected by admin auth middleware
router.use(verifyJWT);

router.get("/stats", dashboardStatsController.getDashboardStats);

export default router;
