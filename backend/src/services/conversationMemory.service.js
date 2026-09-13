import { conversationRepository } from "../repositories/Conversation.repository.js";
import { messageRepository } from "../repositories/Message.repository.js";
import { ENV } from "../config/env.js";

const MAX_HISTORY_MESSAGES = 20;

class ConversationMemoryService {
  async _ensureConversation(instagramUserId) {
    let conversation = await conversationRepository.findByInstagramUserId(instagramUserId);
    if (!conversation) {
      let username = null;
      try {
        if (ENV.INSTAGRAM_ACCESS_TOKEN) {
          const res = await fetch(`https://graph.instagram.com/v21.0/${instagramUserId}?fields=name,username&access_token=${ENV.INSTAGRAM_ACCESS_TOKEN}`);
          if (res.ok) {
            const data = await res.json();
            username = data.username || data.name || null;
          }
        }
      } catch (err) {
        console.error(`[AI Engine] Failed to fetch Instagram profile for ${instagramUserId}:`, err);
      }
      conversation = await conversationRepository.createConversation(instagramUserId, "instagram", username);
    }
    return conversation;
  }

  /**
   * Fetches the formatted conversation history for a given Instagram user ID.
   * Finds or creates the conversation atomically.
   */
  async getConversationHistory(instagramUserId, limit = MAX_HISTORY_MESSAGES) {
    const conversation = await this._ensureConversation(instagramUserId);
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
    const conversation = await this._ensureConversation(instagramUserId);
    await messageRepository.createMessage(conversation._id, "user", content);
    await conversationRepository.updateLastMessageAt(conversation._id);
  }

  /**
   * Records an outgoing assistant response and updates the lastMessageAt timestamp.
   */
  async recordAssistantMessage(instagramUserId, content, language = "unknown") {
    const conversation = await this._ensureConversation(instagramUserId);
    const message = await messageRepository.createMessage(conversation._id, "assistant", content, language);
    await conversationRepository.updateLastMessageAt(conversation._id);
    return message;
  }
}

export const conversationMemoryService = new ConversationMemoryService();
