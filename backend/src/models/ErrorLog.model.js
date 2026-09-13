import mongoose, { Schema } from "mongoose";

const errorLogSchema = new Schema(
  {
    source: {
      type: String,
      enum: ["gemini", "instagram_send", "webhook", "other"],
      required: [true, "Source is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Error message is required"],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Index for efficient filtering by date
errorLogSchema.index({ createdAt: -1 });

export const ErrorLog = mongoose.model("ErrorLog", errorLogSchema);
