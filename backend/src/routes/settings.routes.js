import { Router } from "express";
import { settingsController } from "../controllers/settings.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Protected by admin auth middleware
router.use(verifyJWT);

router.route("/ai-toggle")
  .get(settingsController.getAiToggle)
  .patch(settingsController.updateAiToggle);

export default router;
