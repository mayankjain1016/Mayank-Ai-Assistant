import 'dotenv/config';
import { geminiIntegration } from './src/integrations/gemini/index.js';

async function testGemini() {
  console.log('Testing Gemini API history role validation...');
  
  const history = [
    { role: 'assistant', content: 'Hi, how can I help you?' },
    { role: 'user', content: 'What is your pricing?' },
    { role: 'assistant', content: 'Our pricing is $10/mo.' }
  ];

  try {
    const result = await geminiIntegration.generateAIReply('Can I get a discount?', history);
    console.log('\n--- SUCCESS ---');
    console.log('Reply:', result.replyText);
  } catch (err) {
    console.error('\n--- ERROR CAUGHT ---');
    console.error(err.message || err);
  }
}

testGemini();
