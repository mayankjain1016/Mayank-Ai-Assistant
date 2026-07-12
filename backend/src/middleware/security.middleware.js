import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import { ENV } from "../config/env.js";
import { RATE_LIMIT } from "../config/constants.js";

export const applySecurityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // Prevent Http param pollution
  app.use(hpp());

  // Enable CORS
  app.use(
    cors({
      origin: ENV.CLIENT_URL,
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: RATE_LIMIT.MAX_REQUESTS,
    message: "Too many requests from this IP, please try again later",
  });
  app.use("/api", limiter);
};
