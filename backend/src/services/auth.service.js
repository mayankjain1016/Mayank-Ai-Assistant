import { userRepository } from "../repositories/User.repository.js";
import { authRepository } from "../repositories/Auth.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUS_CODES } from "../config/constants.js";
import { generateAuthTokens, verifyRefreshToken } from "../utils/jwt.util.js"; // or token.util.js if unified, let's use token.util.js

import { generateAuthTokens as generateTokens } from "../utils/token.util.js";
import { verifyRefreshToken as verifyRt } from "../utils/jwt.util.js";


class AuthService {
  async loginUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid email or password");
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, "Account disabled");
    }

    // Update stats
    await userRepository.updateLoginStats(user._id);

    const tokens = generateTokens(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, ...tokens };
  }

  async logoutUser(token) {
    // Future blacklist implementation - will call authRepository when Redis is integrated
    return true;
  }

  async refreshAuth(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Refresh token required");
    }

    try {
      const decoded = verifyRt(refreshToken);
      const user = await userRepository.findById(decoded._id);
      
      if (!user || !user.isActive) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid user");
      }

      return generateTokens(user._id, user.role);
    } catch (error) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid or expired refresh token");
    }
  }
}

export const authService = new AuthService();
