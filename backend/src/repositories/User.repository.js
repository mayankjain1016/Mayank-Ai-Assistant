import { User } from "../models/User.model.js";

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }
  
  async findByEmail(email) {
    return await User.findOne({ email }).select("+password"); // Need password for auth
  }
  
  async create(data) {
    return await User.create(data);
  }

  async updateLoginStats(id) {
    return await User.findByIdAndUpdate(
      id,
      { 
        $set: { lastLogin: new Date() },
        $inc: { loginCount: 1 } 
      },
      { new: true }
    );
  }
}

export const userRepository = new UserRepository();
