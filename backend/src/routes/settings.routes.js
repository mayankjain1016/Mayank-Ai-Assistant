import { Router } from "express";
import { settingsController } from "../controllers/settings.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Protected by admin auth middleware
router.use(authenticate);

router.route("/ai-toggle")
  .get(settingsController.getAiToggle)
  .patch(settingsController.updateAiToggle);

export default router;
