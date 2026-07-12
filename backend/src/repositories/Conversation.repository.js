import { Conversation } from "../models/Conversation.model.js";

class ConversationRepository {
  async findById(id) {
    return await Conversation.findById(id);
  }
  
  async create(data) {
    return await Conversation.create(data);
  }
}

export const conversationRepository = new ConversationRepository();
