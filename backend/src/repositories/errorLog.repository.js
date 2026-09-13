import { ErrorLog } from "../models/ErrorLog.model.js";

class ErrorLogRepository {
  async createErrorLog(source, message, metadata = {}) {
    return await ErrorLog.create({ source, message, metadata });
  }

  async getRecentErrorLogs({ page = 1, limit = 20, source }) {
    const query = {};
    if (source) {
      query.source = source;
    }

    const skip = (page - 1) * limit;

    const [logs, totalCount] = await Promise.all([
      ErrorLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ErrorLog.countDocuments(query),
    ]);

    return {
      logs,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    };
  }

  async getErrorCount({ startDate, endDate, source }) {
    const query = {};
    if (source) query.source = source;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    return await ErrorLog.countDocuments(query);
  }
}

export const errorLogRepository = new ErrorLogRepository();
