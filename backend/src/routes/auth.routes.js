import { Router } from "express";
import { login, logout, getMe, refresh } from "../controllers/auth.controller.js";
import { validateLoginInput } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { User } from "../models/User.model.js";

const router = Router();

router.post("/login", validateLoginInput, login);
router.post("/logout", authenticate, logout);
router.post("/refresh", refresh);
router.get("/me", authenticate, getMe);

// Temporary endpoint to seed an admin user
router.get("/emergency-seed", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@test.com" });
    if (!existingAdmin) {
      await User.create({
        name: "Emergency Admin",
        email: "admin@test.com",
        password: "TestPassword123!",
        role: "admin",
        businessName: "Test Co",
        isActive: true,
      });
    }
    res.send("Admin seeded successfully.");
  } catch (err) {
    res.send(err.message);
  }
});

export default router;
