import mongoose from "mongoose";
import { database } from "../config/database.js";
import logger from "../config/logger.js";

/**
 * Database Service Layer
 * Responsibilities:
 * - Database status checking
 * - Connection monitoring
 * - Reusable database utilities
 */
class DatabaseService {
  /**
   * Check if the database is currently connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get detailed health metrics of the database connection
   * @returns {Object} Health status object
   */
  async getHealthStatus() {
    try {
      if (!this.isConnected()) {
        return {
          status: "disconnected",
          message: "Database is not connected",
        };
      }

      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();

      return {
        status: "connected",
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        connections: serverStatus.connections.current,
        uptime: serverStatus.uptime,
        version: serverStatus.version,
      };
    } catch (error) {
      logger.error(`Error fetching database health status: ${error.message}`);
      return {
        status: "error",
        message: "Failed to retrieve database health",
      };
    }
  }

  /**
   * Disconnect the database gracefully
   */
  async disconnectGracefully() {
    await database.disconnect();
  }
}

export const databaseService = new DatabaseService();
