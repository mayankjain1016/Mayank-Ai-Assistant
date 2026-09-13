import { errorLogRepository } from "../repositories/errorLog.repository.js";

class ErrorLogService {
  /**
   * Logs an error to the database. Catches all internal errors to ensure
   * logging failures never crash the calling flow.
   */
  async logError(source, message, metadata = {}) {
    try {
      await errorLogRepository.createErrorLog(source, message, metadata);
    } catch (err) {
      console.error(`[ErrorLogService] Failed to log error for source ${source}:`, err);
    }
  }

  async getRecentErrorLogs(options) {
    return await errorLogRepository.getRecentErrorLogs(options);
  }
}

export const errorLogService = new ErrorLogService();
