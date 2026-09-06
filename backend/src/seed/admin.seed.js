import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { User } from "../models/User.model.js";
import { hashPassword } from "../utils/password.util.js";
import { validateAuthCredentials } from "../validators/auth.validator.js";

const seedAdmin = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(ENV.MONGODB_URI);
    console.log("Connected Successfully.");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "System Admin";
    const adminRole = process.env.ADMIN_ROLE || "admin";

    if (!adminEmail || !adminPassword) {
      console.error("FATAL: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in environment variables.");
      process.exit(1);
    }

    // Validate credentials using our standard auth validator
    validateAuthCredentials(adminEmail, adminPassword);

    // Check idempotency
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists. Skipping seed.`);
      process.exit(0);
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // Will be hashed automatically by User.model.js pre-save hook
      role: adminRole,
      businessName: "Internal Admin",
      isActive: true,
    });

    console.log(`Successfully created admin user: ${adminEmail}`);
    process.exit(0);

  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
