import { conversationRepository } from "../repositories/Conversation.repository.js";
import { messageRepository } from "../repositories/Message.repository.js";

const MAX_HISTORY_MESSAGES = 20;

class ConversationMemoryService {
  /**
   * Fetches the formatted conversation history for a given Instagram user ID.
   * Finds or creates the conversation atomically.
   */
  async getConversationHistory(instagramUserId, limit = MAX_HISTORY_MESSAGES) {
    const conversation = await conversationRepository.findOrCreateByInstagramUserId(instagramUserId);
    const messages = await messageRepository.getRecentMessages(conversation._id, limit);

    // Map into the exact format Gemini expects
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Records an incoming user message and updates the lastMessageAt timestamp.
   */
  async recordUserMessage(instagramUserId, content) {
    const conversation = await conversationRepository.findOrCreateByInstagramUserId(instagramUserId);
    await messageRepository.createMessage(conversation._id, "user", content);
    await conversationRepository.updateLastMessageAt(conversation._id);
  }

  /**
   * Records an outgoing assistant response and updates the lastMessageAt timestamp.
   */
  async recordAssistantMessage(instagramUserId, content, language = "unknown") {
    const conversation = await conversationRepository.findOrCreateByInstagramUserId(instagramUserId);
    const message = await messageRepository.createMessage(conversation._id, "assistant", content, language);
    await conversationRepository.updateLastMessageAt(conversation._id);
    return message;
  }
}

export const conversationMemoryService = new ConversationMemoryService();
