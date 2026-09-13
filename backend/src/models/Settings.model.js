import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    aiEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const Settings = mongoose.model("Settings", settingsSchema);
