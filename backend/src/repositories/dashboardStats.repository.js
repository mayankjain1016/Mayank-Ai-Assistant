import { Message } from "../models/Message.model.js";
import { Conversation } from "../models/Conversation.model.js";

class DashboardStatsRepository {
  async getMessageCount(role, startDate) {
    const query = { role };
    if (startDate) {
      query.createdAt = { $gte: startDate };
    }
    return await Message.countDocuments(query);
  }

  async getNewLeadsCount(startDate) {
    const query = {};
    if (startDate) {
      query.createdAt = { $gte: startDate };
    }
    return await Conversation.countDocuments(query);
  }

  async getActiveUsersCount(startDate) {
    const query = {};
    if (startDate) {
      query.lastMessageAt = { $gte: startDate };
    }
    return await Conversation.countDocuments(query);
  }

  /**
   * Computes the average response time (user -> assistant) in seconds.
   * Reason for Application-Level Fallback: A pure Mongoose aggregation using $lookup or 
   * $setWindowFields for consecutive row calculation is complex, potentially slow for large 
   * collections without specific compound indexing on (conversationId, role, createdAt), 
   * and can fail on older MongoDB versions.
   * This application-level approach fetches the required fields in a single query and 
   * processes them in strict O(N) time.
   */
  async getAverageResponseTime(startDate) {
    const query = {};
    if (startDate) {
      query.createdAt = { $gte: startDate };
    }

    // Fetch only necessary fields, sorted by conversation then by time
    const messages = await Message.find(query)
      .select("conversationId role createdAt")
      .sort({ conversationId: 1, createdAt: 1 })
      .lean();

    let totalDiffMs = 0;
    let pairCount = 0;

    // O(N) single-pass calculation
    for (let i = 0; i < messages.length - 1; i++) {
      const current = messages[i];
      const next = messages[i + 1];

      if (
        current.conversationId.toString() === next.conversationId.toString() &&
        current.role === "user" &&
        next.role === "assistant"
      ) {
        const diffMs = next.createdAt.getTime() - current.createdAt.getTime();
        totalDiffMs += diffMs;
        pairCount++;
      }
    }

    if (pairCount === 0) return 0;
    return Math.round(totalDiffMs / pairCount / 1000); // Return in seconds
  }
}

export const dashboardStatsRepository = new DashboardStatsRepository();
