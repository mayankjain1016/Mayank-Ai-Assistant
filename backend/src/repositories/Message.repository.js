import { Message } from "../models/Message.model.js";

class MessageRepository {
  async createMessage(conversationId, role, content, language = "unknown") {
    return await Message.create({ conversationId, role, content, language });
  }

  async getRecentMessages(conversationId, limit = 20) {
    // Fetch the most recent N messages sorted chronologically (oldest first for Gemini history)
    // We sort by createdAt DESC to get the newest limit, then reverse in JS to maintain oldest-first order
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return messages.reverse();
  }

  async getFullHistory(conversationId) {
    return await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();
  }

  async getDailyMessageTrends({ days = 7 }) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const trends = await Message.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Fill gaps with zeros for all days
    const dailyMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyMap[dateStr] = { date: dateStr, userMessages: 0, assistantMessages: 0 };
    }

    trends.forEach((item) => {
      const date = item._id.date;
      const role = item._id.role;
      if (dailyMap[date]) {
        if (role === "user") dailyMap[date].userMessages = item.count;
        if (role === "assistant") dailyMap[date].assistantMessages = item.count;
      }
    });

    // Return sorted oldest to newest
    return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getLanguageBreakdown({ startDate, endDate }) {
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const result = await Message.aggregate([
      { $match: query },
      { $group: { _id: "$language", count: { $sum: 1 } } }
    ]);

    const total = result.reduce((acc, curr) => acc + curr.count, 0);
    return result.map((item) => ({
      language: item._id || "unknown",
      count: item.count,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(2) : 0
    }));
  }

  async getMessageCount({ startDate, endDate, role }) {
    const query = {};
    if (role) query.role = role;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }
    return await Message.countDocuments(query);
  }
}

export const messageRepository = new MessageRepository();
