import { conversationRepository } from "../repositories/Conversation.repository.js";
import { messageRepository } from "../repositories/Message.repository.js";
import { Conversation } from "../models/Conversation.model.js";

class AnalyticsService {
  async getConversationsList(options) {
    return await conversationRepository.findConversationsPaginated(options);
  }

  async getConversationDetail(conversationId) {
    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) return null;

    const messages = await messageRepository.getFullHistory(conversationId);
    return {
      ...conversation,
      messages,
    };
  }

  async getDailyTrends(options) {
    return await messageRepository.getDailyMessageTrends(options);
  }

  async getLanguageBreakdown(options) {
    return await messageRepository.getLanguageBreakdown(options);
  }
}

export const analyticsService = new AnalyticsService();
