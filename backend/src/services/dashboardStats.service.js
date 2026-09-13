import { dashboardStatsRepository } from "../repositories/dashboardStats.repository.js";
import { errorLogRepository } from "../repositories/errorLog.repository.js";
import { messageRepository } from "../repositories/Message.repository.js";

class DashboardStatsService {
  async getStats(periodDays = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const activeUsersStartDate = new Date();
    activeUsersStartDate.setHours(activeUsersStartDate.getHours() - 24); // Active users always 24h window by default

    // Execute queries concurrently for better performance
    const [
      totalDMs,
      aiReplies,
      newLeads,
      activeUsers,
      avgResponseTimeSeconds
    ] = await Promise.all([
      dashboardStatsRepository.getMessageCount("user", startDate),
      dashboardStatsRepository.getMessageCount("assistant", startDate),
      dashboardStatsRepository.getNewLeadsCount(startDate),
      dashboardStatsRepository.getActiveUsersCount(activeUsersStartDate),
      dashboardStatsRepository.getAverageResponseTime(startDate)
    ]);

    return {
      totalDMs,
      aiReplies,
      newLeads,
      activeUsers,
      avgResponseTimeSeconds
    };
  }

  async getAiFailureRate(options = {}) {
    const [errorCount, userMessageCount] = await Promise.all([
      errorLogRepository.getErrorCount({ ...options, source: "gemini" }),
      messageRepository.getMessageCount({ ...options, role: "user" })
    ]);

    const percentage = userMessageCount > 0 
      ? ((errorCount / userMessageCount) * 100).toFixed(2)
      : 0;

    return {
      errorCount,
      userMessageCount,
      percentage: Number(percentage)
    };
  }
}

export const dashboardStatsService = new DashboardStatsService();
