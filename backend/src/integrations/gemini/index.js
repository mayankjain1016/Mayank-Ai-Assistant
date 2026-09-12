import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../../config/env.js";
import logger from "../../config/logger.js"; // Fallback to console if logger isn't available

class GeminiIntegration {
  constructor() {
    if (!ENV.GEMINI_API_KEY) {
      console.warn("WARNING: GEMINI_API_KEY is not set in environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    // Use a fast and cost-effective model
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  /**
   * Generates a conversational reply using Google Gemini AI.
   * @param {string} userMessage - The latest message from the user
   * @param {Array} [conversationHistory=[]] - Optional history for context
   * @returns {Promise<string>} The generated reply or a fallback message
   */
  async generateAIReply(userMessage, conversationHistory = []) {
    try {
      const systemPrompt = `
You are a friendly, natural-sounding personal assistant managing my Instagram DMs.
Your goal is to be helpful, casual, and engaging, exactly like a real person texting on Instagram.

CRITICAL RULES:
1. Detect the language style of the user's message (English, pure Hindi, or Hinglish/Roman Hindi).
2. Reply strictly in the EXACT SAME language style. If they use Hinglish, you must use Hinglish.
3. Keep your response short, natural, and conversational (1-3 brief sentences max).
4. Do NOT sound robotic, overly formal, or like a traditional AI assistant.
5. Use minimal emojis, just enough to be friendly.
`;

      // Build chat session with history if provided
      const chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "Got it! I will act as a natural Instagram DM assistant following these language rules." }],
          },
          ...conversationHistory.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          }))
        ],
        generationConfig: {
          temperature: 0.7, // Add some creativity but stay grounded
          maxOutputTokens: 150, // Keep responses short for IG DMs
        },
      });

      const result = await chat.sendMessage(userMessage);
      const responseText = result.response.text();
      
      return responseText.trim();
    } catch (error) {
      console.error("Gemini AI API Error:", error.message || error);
      // Fallback message to prevent crashing or silent failures
      return "Hey there! I'm currently unavailable, but Mayank will get back to you shortly. Thanks! 🙏";
    }
  }
}

export const geminiIntegration = new GeminiIntegration();

