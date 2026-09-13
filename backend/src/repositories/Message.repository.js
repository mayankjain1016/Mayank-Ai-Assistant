import { Message } from "../models/Message.model.js";

class MessageRepository {
  async createMessage(conversationId, role, content) {
    return await Message.create({ conversationId, role, content });
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
}

export const messageRepository = new MessageRepository();
