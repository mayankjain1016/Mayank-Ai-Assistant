import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";

// Middlewares
import { applySecurityMiddleware } from "./middleware/security.middleware.js";
import { morganMiddleware } from "./middleware/logger.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";

// Routes
import apiRoutes from "./routes/index.js";

const app = express();

// 1. Security Middlewares
applySecurityMiddleware(app);

// 2. Logging Middleware
app.use(morganMiddleware);

// 3. Body Parsing & Cookie Parsing Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(compression());

// 4. API Routes
app.use("/", apiRoutes);

// 5. 404 Handler
app.use(notFoundHandler);

// 6. Global Error Handler
app.use(errorHandler);

export { app };
