import 'dotenv/config';
import { geminiIntegration } from './src/integrations/gemini/index.js';

async function testGeminiRobustness() {
  console.log("=== GEMINI ROBUSTNESS TESTS ===\n");

  // Scenario A: History starting with model role
  console.log("TEST A: History starts with model role");
  const historyA = [
    { role: 'assistant', content: 'Hi there!' },
    { role: 'user', content: 'What is this?' }
  ];
  const resA = geminiIntegration._sanitizeHistory(historyA);
  console.log("Sanitized:", JSON.stringify(resA, null, 2));
  
  // Scenario B: Consecutive same-role messages
  console.log("\nTEST B: Consecutive same-role messages");
  const historyB = [
    { role: 'user', content: 'Hello' },
    { role: 'user', content: 'Are you there?' },
    { role: 'assistant', content: 'Yes!' },
    { role: 'assistant', content: 'I am here.' }
  ];
  const resB = geminiIntegration._sanitizeHistory(historyB);
  console.log("Sanitized:", JSON.stringify(resB, null, 2));

  // Scenario C: Normal valid case
  console.log("\nTEST C: Normal valid case");
  const historyC = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi!' }
  ];
  const resC = geminiIntegration._sanitizeHistory(historyC);
  console.log("Sanitized:", JSON.stringify(resC, null, 2));

  // Scenario D: API failure graceful fallback
  console.log("\nTEST D: Full generateAIReply flow with missing API Key (should fallback gracefully)");
  try {
    const resD = await geminiIntegration.generateAIReply('Tell me a joke!', historyB);
    console.log("Result:", resD);
  } catch (err) {
    console.error("UNEXPECTED CRASH:", err);
  }
}

testGeminiRobustness();
