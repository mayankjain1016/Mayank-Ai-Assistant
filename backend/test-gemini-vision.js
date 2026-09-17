import 'dotenv/config';
import { geminiIntegration } from './src/integrations/gemini/index.js';

async function testVision() {
  console.log("=== GEMINI VISION TEST ===\n");

  // A public dummy image of a golden retriever puppy
  const imageUrl = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=60";
  
  console.log(`Downloading image from: ${imageUrl}`);
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error("Failed to download image");
  const buffer = await res.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  console.log(`Image downloaded. Size: ${base64Image.length} chars (base64)`);

  const prompt = "Can you tell me what kind of dog this is?";
  console.log(`\nUser Prompt: "${prompt}"`);
  console.log("Generating AI Reply with Vision...");

  try {
    const result = await geminiIntegration.generateAIReply(prompt, [], base64Image);
    console.log("\nAI Result:", result);
  } catch(e) {
    console.error("Test Crash:", e);
  }
}
testVision();
