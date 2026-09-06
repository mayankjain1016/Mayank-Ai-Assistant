import bcrypt from "bcryptjs";
import { ENV } from "../config/env.js";

/**
 * Hashes a plaintext password using bcrypt.
 * Note: The Mongoose pre-save hook handles automatic hashing during normal document creation.
 * This utility is useful for raw operations, like Seeding.
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(ENV.BCRYPT_SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a plaintext password against a hashed password.
 * Note: The Mongoose model instance method isPasswordCorrect is preferred for User docs.
 */
export const comparePassword = async (plaintext, hashed) => {
  return await bcrypt.compare(plaintext, hashed);
};
