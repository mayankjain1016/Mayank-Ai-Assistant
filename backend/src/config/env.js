import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "",
  DATABASE_NAME: process.env.DATABASE_NAME || "mayank_ai_assistant",
  JWT_SECRET: process.env.JWT_SECRET || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  INSTAGRAM_VERIFY_TOKEN: process.env.INSTAGRAM_VERIFY_TOKEN || "",
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || "",
  SESSION_SECRET: process.env.SESSION_SECRET || "",
};

// Validate critical environment variables
const requiredEnvVars = ["MONGODB_URI"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`[FATAL] Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}
