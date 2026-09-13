import { Conversation } from "../models/Conversation.model.js";

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
}

export const conversationRepository = new ConversationRepository();
