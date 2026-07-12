import mongoose from "mongoose";
import logger from "./logger.js";
import { ENV } from "./env.js";

/**
 * MongoDB Connection Manager
 * Follows enterprise SaaS best practices for robust connection handling.
 */
class Database {
  constructor() {
    this.connection = null;
    this.options = {
      dbName: ENV.DATABASE_NAME,
      autoIndex: true, // Set to false in production if managing indexes manually
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50, // Maintain up to 50 socket connections
      minPoolSize: 10, // Keep 10 active connections
      family: 4, // Use IPv4, skip trying IPv6
    };
  }

  async connect() {
    if (this.connection) {
      logger.info("Using existing database connection.");
      return this.connection;
    }

    try {
      mongoose.set("strictQuery", true);
      this.connection = await mongoose.connect(ENV.MONGODB_URI, this.options);
      
      logger.info("=================================");
      logger.info(`🗄️  Database Connected Successfully!`);
      logger.info(`Host: ${this.connection.connection.host}`);
      logger.info(`Name: ${this.connection.connection.name}`);
      logger.info("=================================");

      // Register connection events
      this.handleConnectionEvents();

      return this.connection;
    } catch (error) {
      logger.error(`[FATAL] Database connection failed: ${error.message}`);
      // Never allow silent database failures on startup
      process.exit(1);
    }
  }

  handleConnectionEvents() {
    mongoose.connection.on("connected", () => {
      logger.info("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Mongoose disconnected. Attempting to reconnect...");
    });
    
    mongoose.connection.on("reconnected", () => {
      logger.info("Mongoose reconnected to DB");
    });
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      logger.info("Database disconnected gracefully.");
      this.connection = null;
    }
  }
}

// Export a singleton instance
export const database = new Database();
