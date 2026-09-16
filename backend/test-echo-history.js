import 'dotenv/config';
import { geminiIntegration } from './src/integrations/gemini/index.js';

async function testEchoHistory() {
  console.log("=== ECHO MESSAGES CONTEXT TEST ===\n");

  // Simulating a conversation where AI handles the first part, then a human jumps in manually, 
  // and then the AI takes over again.
  const history = [
    { role: 'user', content: 'Hey, I need help with my order.' },
    { role: 'assistant', content: 'Sure, I can help with that. What is your order number?' }, // Sent by AI
    { role: 'user', content: 'Order #12345' },
    { role: 'assistant', content: 'Thank you. Let me check... Ah, I see it. It is delayed by 2 days.' }, // Echo (Human)
    { role: 'assistant', content: 'I am so sorry for the inconvenience, I will throw in a free gift.' }, // Echo (Human)
    { role: 'user', content: 'That would be great, thank you!' }
  ];

  console.log("1. Original Mixed History (from DB):");
  history.forEach(m => console.log(`[${m.role.toUpperCase()}] ${m.content}`));

  console.log("\n2. Sanitized History for Gemini Context:");
  const sanitized = geminiIntegration._sanitizeHistory(history);
  console.log(JSON.stringify(sanitized, null, 2));

  console.log("\n3. Simulating Live AI Call...");
  const prompt = "Can you also confirm my shipping address?";
  console.log(`User Prompt: "${prompt}"`);

  try {
    const result = await geminiIntegration.generateAIReply(prompt, history);
    console.log("AI Result:", result);
  } catch (err) {
    console.error("CRASH:", err);
  }
}

testEchoHistory();
