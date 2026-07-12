import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Conversation ID is required"],
      index: true,
    },
    sender: {
      type: String,
      enum: ["customer", "ai", "human"],
      required: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    messageType: {
      type: String,
      enum: ["text", "image", "audio", "video"],
      default: "text",
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiModel: {
      type: String,
      default: null, // e.g., 'gemini-1.5-pro'
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed, // flexible metadata for files/media references
      default: {},
    },
  },
  {
    timestamps: true, // we will primarily rely on createdAt for indexing messages
  }
);

// Optimize for high volume read/writes on conversation feeds
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
