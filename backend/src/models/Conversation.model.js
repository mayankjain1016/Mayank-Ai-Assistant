import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    instagramUserId: {
      type: String,
      required: [true, "Instagram User ID is required"],
      index: true,
      unique: true, // compound/unique index so each user maps to exactly one Conversation
    },
    username: {
      type: String,
    },
    platform: {
      type: String,
      default: "instagram",
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
