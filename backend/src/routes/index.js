import { Router } from "express";
import healthRoutes from "./health.routes.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { STATUS_CODES } from "../config/constants.js";

const router = Router();

// Base route
router.get("/", (req, res) => {
  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, null, "Welcome to Mayank AI Assistant API"));
});

// Mount modular routes
router.use("/api/health", healthRoutes);

export default router;
