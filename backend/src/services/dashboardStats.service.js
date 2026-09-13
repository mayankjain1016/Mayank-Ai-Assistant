import { dashboardStatsRepository } from "../repositories/dashboardStats.repository.js";

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
}

export const dashboardStatsService = new DashboardStatsService();
