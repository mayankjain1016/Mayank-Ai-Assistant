import { app } from "./app.js";
import { ENV } from "./config/env.js";
import logger from "./config/logger.js";
import { APP_NAME } from "./config/constants.js";

const startServer = () => {
  const server = app.listen(ENV.PORT, () => {
    logger.info("=================================");
    logger.info(`🚀 ${APP_NAME} Started!`);
    logger.info(`=================================`);
    logger.info(`Port: ${ENV.PORT}`);
    logger.info(`Environment: ${ENV.NODE_ENV}`);
    logger.info(`Status: Running 🟢`);
    logger.info("=================================");
  });

  // Graceful Shutdown
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info("Server closed.");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(`Unexpected Error: ${error}`);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received");
    if (server) {
      server.close();
    }
  });
};

startServer();
