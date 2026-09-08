import { ENV } from "../config/env.js";

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
    
    console.log("Incoming Instagram Webhook Event:", JSON.stringify(body, null, 2));
    
    // Return a '200 OK' response to all events
    return res.status(200).send("EVENT_RECEIVED");
  }
};
