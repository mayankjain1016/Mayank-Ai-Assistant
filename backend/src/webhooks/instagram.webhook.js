import { ENV } from "../config/env.js";
import { geminiIntegration } from "../integrations/gemini/index.js";
import { conversationMemoryService } from "../services/conversationMemory.service.js";

async function processInstagramMessage(senderId, messageText) {
  try {
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

    console.log(`[AI Engine] Generating reply for message: "${messageText}"`);
    
    // 3. Generate AI Reply using the fetched history
    const replyText = await geminiIntegration.generateAIReply(messageText, history);
    console.log(`[AI Engine] Generated reply: "${replyText}"`);

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
    } else {
      console.log("[AI Engine] Reply sent successfully!");
      
      // 4. Record the outgoing assistant message (only if sent successfully)
      try {
        await conversationMemoryService.recordAssistantMessage(senderId, replyText);
      } catch (dbError) {
        console.error("[AI Engine] Failed to record assistant message in DB:", dbError);
      }
    }
  } catch (error) {
    console.error("[AI Engine] Error processing message asynchronously:", error);
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

          // Check if it's a standard text message (not an echo, not a reaction)
          if (senderId && message && message.text && !message.is_echo) {
            console.log(`\n[Webhook] Received text message from ${senderId}: ${message.text}`);
            
            // Fire and forget asynchronous processing - DO NOT await here so Meta gets a 200 OK fast
            processInstagramMessage(senderId, message.text);
          } else {
            console.log(`[Webhook] Ignored non-text or echo message`);
          }
        });
      });
    }
    
    // Return a '200 OK' response to all events IMMEDIATELY
    return res.status(200).send("EVENT_RECEIVED");
  }
};
