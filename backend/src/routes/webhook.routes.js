import { Router } from "express";
import { handleInstagramWebhook } from "../webhooks/instagram.webhook.js";

const router = Router();

// Meta/Instagram requires GET for webhook verification, and POST for event notifications
router.get("/instagram", handleInstagramWebhook);
router.post("/instagram", handleInstagramWebhook);

export default router;
