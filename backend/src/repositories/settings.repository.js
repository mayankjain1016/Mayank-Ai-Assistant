import { Settings } from "../models/Settings.model.js";

// Fixed ID for the singleton settings document
const SETTINGS_ID = "000000000000000000000000"; 

class SettingsRepository {
  async getSettings() {
    // Find the singleton doc, or create it with defaults if it doesn't exist
    return await Settings.findByIdAndUpdate(
      SETTINGS_ID,
      { $setOnInsert: { _id: SETTINGS_ID, aiEnabled: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async updateAiEnabled(enabled) {
    return await Settings.findByIdAndUpdate(
      SETTINGS_ID,
      { aiEnabled: enabled },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

export const settingsRepository = new SettingsRepository();
