import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { _id: userId, role },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: ENV.ACCESS_TOKEN_EXPIRES }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: ENV.REFRESH_TOKEN_EXPIRES }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
};
