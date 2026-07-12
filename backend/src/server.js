import { app } from "./app.js";
import { ENV } from "./config/env.js";
import logger from "./config/logger.js";
import { APP_NAME } from "./config/constants.js";
import { database } from "./config/database.js";

const startServer = async () => {
  try {
    // 1. Connect to Database first
    await database.connect();

    // 2. Start Express Server
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
    const exitHandler = async () => {
      if (server) {
        server.close(async () => {
          logger.info("Server closed.");
          await database.disconnect();
          process.exit(1);
        });
      } else {
        await database.disconnect();
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      logger.error(`Unexpected Error: ${error}`);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received");
      if (server) {
        server.close(async () => {
          logger.info("Server closed due to SIGTERM.");
          await database.disconnect();
          process.exit(0);
        });
      } else {
        await database.disconnect();
        process.exit(0);
      }
    });

    process.on("SIGINT", async () => {
      logger.info("SIGINT received");
      if (server) {
        server.close(async () => {
          logger.info("Server closed due to SIGINT.");
          await database.disconnect();
          process.exit(0);
        });
      } else {
        await database.disconnect();
        process.exit(0);
      }
    });

  } catch (error) {
    logger.error(`[FATAL] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
