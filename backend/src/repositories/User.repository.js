import { User } from "../models/User.model.js";

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }
  
  async create(data) {
    return await User.create(data);
  }
}

export const userRepository = new UserRepository();
