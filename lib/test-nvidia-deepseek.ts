import { getAIClient } from './ai-client';

async function testNVIDIADeepSeek() {
  try {
    console.log('🚀 Testing NVIDIA DeepSeek AI integration...');
    
    const client = getAIClient();
    
    const testMessages = [
      {
        role: 'user' as const,
        content: 'Generate a brief job description for a Software Engineer position at Google. Keep it under 100 words.'
      }
    ];

    console.log('📝 Sending test request to NVIDIA DeepSeek...');
    const response = await client.callAPI(testMessages);
    
    console.log('✅ Response received:');
    console.log(response.choices[0]?.message?.content);
    
    return true;
  } catch (error) {
    console.error('❌ Error testing NVIDIA DeepSeek:', error);
    return false;
  }
}

// Export for testing
export { testNVIDIADeepSeek };
