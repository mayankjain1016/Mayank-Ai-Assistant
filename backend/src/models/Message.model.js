import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Conversation ID is required"],
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: [true, "Role is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    language: {
      type: String,
      enum: ["hindi", "english", "hinglish", "unknown"],
      default: "unknown",
    },
    sentBy: {
      type: String,
      enum: ["user", "ai", "human"],
      default: "user"
    }
  },
  {
    timestamps: true, // Automatically manages createdAt
  }
);

// Index for efficient ordered history queries
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
