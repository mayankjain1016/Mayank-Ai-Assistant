import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    businessUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Business User ID is required"],
      index: true,
    },
    customerInstagramId: {
      type: String,
      required: [true, "Customer Instagram ID is required"],
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    conversationStatus: {
      type: String,
      enum: ["active", "closed", "pending"],
      default: "active",
      index: true,
    },
    leadStatus: {
      type: String,
      enum: ["new", "interested", "converted", "lost"],
      default: "new",
      index: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    aiEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying specific user's conversations quickly
conversationSchema.index({ businessUserId: 1, customerInstagramId: 1 }, { unique: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);
