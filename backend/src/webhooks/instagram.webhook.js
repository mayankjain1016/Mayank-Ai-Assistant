import { ENV } from "../config/env.js";
import { geminiIntegration } from "../integrations/gemini/index.js";
import { conversationMemoryService } from "../services/conversationMemory.service.js";
import { settingsService } from "../services/settings.service.js";
import { errorLogService } from "../services/errorLog.service.js";

async function processInstagramMessage(senderId, messageText, skipAI = false) {
  try {
    let replyText = "";
    let language = "unknown";
    
    if (skipAI) {
      console.log(`[AI Engine] Skipping AI generation, using hardcoded reply.`);
      replyText = messageText;
    } else {
      let history = [];
      
      // 1. Fetch conversation history
      try {
        history = await conversationMemoryService.getConversationHistory(senderId);
        console.log(`[AI Engine] Fetched ${history.length} previous messages for context.`);
      } catch (dbError) {
        console.error("[AI Engine] Failed to fetch conversation history, falling back to empty context:", dbError);
      }

      // 2. Record the incoming user message
      try {
        await conversationMemoryService.recordUserMessage(senderId, messageText);
      } catch (dbError) {
        console.error("[AI Engine] Failed to record user message in DB:", dbError);
      }

      // Check if AI auto-reply is currently enabled
      let aiStatus;
      try {
        aiStatus = await settingsService.getAiToggleStatus();
      } catch (dbError) {
        console.error("[AI Engine] Failed to fetch AI toggle status, defaulting to enabled.", dbError);
        aiStatus = { aiEnabled: true };
      }

      if (!aiStatus.aiEnabled) {
        console.log(`[AI Engine] AI auto-reply is globally DISABLED. Skipping auto-reply for user: ${senderId}.`);
        return; // We still recorded the user's message above!
      }

      console.log(`[AI Engine] Generating reply for message: "${messageText}"`);
      
      // 3. Generate AI Reply using the fetched history
      const result = await geminiIntegration.generateAIReply(messageText, history);
      replyText = result.replyText;
      language = result.language;
      console.log(`[AI Engine] Generated reply: "${replyText}" (Language: ${language})`);
    }

    console.log(`[AI Engine] Sending reply to Instagram for user: ${senderId}`);
    
    if (!ENV.INSTAGRAM_ACCESS_TOKEN) {
      console.error("[AI Engine] Missing INSTAGRAM_ACCESS_TOKEN in environment variables!");
      return;
    }

    const response = await fetch(`https://graph.instagram.com/v21.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV.INSTAGRAM_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: { text: replyText }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[AI Engine] Failed to send message via Meta Graph API:", errorData);
      
      await errorLogService.logError("instagram_send", "Failed to send message via Meta Graph API", {
        recipientId: senderId,
        errorData
      });
    } else {
      console.log("[AI Engine] Reply sent successfully!");
      
      // 4. Record the outgoing assistant message
      try {
        await conversationMemoryService.recordAssistantMessage(senderId, replyText, language);
      } catch (dbError) {
        console.error("[AI Engine] Failed to record assistant message in DB:", dbError);
      }
    }
  } catch (error) {
    console.error("[AI Engine] Error processing message asynchronously:", error);
    await errorLogService.logError("webhook", error.message || String(error), { senderId });
  }
}

export const handleInstagramWebhook = async (req, res) => {
  if (req.method === "GET") {
    // Meta webhook verification
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === ENV.INSTAGRAM_VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
  } else if (req.method === "POST") {
    // Handle actual incoming webhook events
    const body = req.body;
    
    if (body.entry) {
      body.entry.forEach(entry => {
        const webhookEvents = entry.messaging || [];
        
        webhookEvents.forEach(webhookEvent => {
          const senderId = webhookEvent.sender?.id;
          const message = webhookEvent.message;

          if (senderId && message && !message.is_echo) {
            // Log FULL raw message for debugging image attachments
            console.log(`\n[Webhook] RAW MESSAGE OBJECT:`, JSON.stringify(message, null, 2));

            if (message.attachments && message.attachments.length > 0) {
              console.log(`[Webhook] Message contains attachments. Sending generic fallback.`);
              const fallbackReply = "Nice pic! I'll get back to you on that soon ✨";
              processInstagramMessage(senderId, fallbackReply, true);
            } else if (message.text) {
              console.log(`[Webhook] Received text message from ${senderId}: ${message.text}`);
              processInstagramMessage(senderId, message.text, false);
            } else {
              console.log(`[Webhook] Ignored non-text message without attachments.`);
            }
          }
        });
      });
    }
    
    // Return a '200 OK' response to all events IMMEDIATELY
    return res.status(200).send("EVENT_RECEIVED");
  }
};
