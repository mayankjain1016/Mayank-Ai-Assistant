import { settingsRepository } from "../repositories/settings.repository.js";

class SettingsService {
  async getAiToggleStatus() {
    const settings = await settingsRepository.getSettings();
    return { aiEnabled: settings.aiEnabled };
  }

  async setAiToggleStatus(enabled) {
    const settings = await settingsRepository.updateAiEnabled(enabled);
    return { aiEnabled: settings.aiEnabled };
  }
}

export const settingsService = new SettingsService();
