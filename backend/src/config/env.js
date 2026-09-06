import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "",
  DATABASE_NAME: process.env.DATABASE_NAME || "mayank_ai_assistant",
  
  // Authentication
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_access_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret",
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),

  // Admin Seed System
  ADMIN_NAME: process.env.ADMIN_NAME || "System Admin",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@example.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
  ADMIN_ROLE: process.env.ADMIN_ROLE || "admin",

  // Integrations
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  INSTAGRAM_VERIFY_TOKEN: process.env.INSTAGRAM_VERIFY_TOKEN || "",
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || "",
  SESSION_SECRET: process.env.SESSION_SECRET || "",
};

// Validate critical environment variables
const requiredEnvVars = ["MONGODB_URI", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`[FATAL] Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}
