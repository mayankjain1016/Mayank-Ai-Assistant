import { Message } from "../models/Message.model.js";

class MessageRepository {
  async findById(id) {
    return await Message.findById(id);
  }
  
  async create(data) {
    return await Message.create(data);
  }
}

export const messageRepository = new MessageRepository();
