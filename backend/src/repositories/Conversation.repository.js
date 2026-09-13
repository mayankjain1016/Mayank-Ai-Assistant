import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";

class ConversationRepository {
  async findByInstagramUserId(instagramUserId) {
    return await Conversation.findOne({ instagramUserId });
  }

  async createConversation(instagramUserId, platform = "instagram") {
    return await Conversation.create({ instagramUserId, platform });
  }

  async findOrCreateByInstagramUserId(instagramUserId) {
    // Atomic find-or-create using findOneAndUpdate with upsert: true
    return await Conversation.findOneAndUpdate(
      { instagramUserId },
      { $setOnInsert: { instagramUserId, platform: "instagram" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async updateLastMessageAt(conversationId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessageAt: new Date() },
      { new: true }
    );
  }

  async findConversationsPaginated({ page = 1, limit = 20, startDate, endDate }) {
    const query = {};
    if (startDate || endDate) {
      query.lastMessageAt = {};
      if (startDate) query.lastMessageAt.$gte = startDate;
      if (endDate) query.lastMessageAt.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [conversations, totalCount] = await Promise.all([
      Conversation.find(query)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Conversation.countDocuments(query),
    ]);

    // Compute messageCount efficiently for the paginated subset
    if (conversations.length > 0) {
      const conversationIds = conversations.map((c) => c._id);
      
      const counts = await Message.aggregate([
        { $match: { conversationId: { $in: conversationIds } } },
        { $group: { _id: "$conversationId", count: { $sum: 1 } } }
      ]);

      const countMap = counts.reduce((acc, curr) => {
        acc[curr._id.toString()] = curr.count;
        return acc;
      }, {});

      conversations.forEach((c) => {
        c.messageCount = countMap[c._id.toString()] || 0;
      });
    }

    return {
      conversations,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    };
  }
}

export const conversationRepository = new ConversationRepository();
