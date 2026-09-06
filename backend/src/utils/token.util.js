import { generateAccessToken, generateRefreshToken } from "./jwt.util.js";

export const generateAuthTokens = (userId, role) => {
  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};
