import { Router } from "express";
import { login, logout, getMe, refresh } from "../controllers/auth.controller.js";
import { validateLoginInput } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", validateLoginInput, login);
router.post("/logout", authenticate, logout);
router.post("/refresh", refresh);
router.get("/me", authenticate, getMe);

export default router;
