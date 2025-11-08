/**
 * Test script for AIML API integration
 * Run with: node scripts/testAIMLAPI.js
 */
const fetch = require('node-fetch');
require('dotenv').config();

async function testAIMLAPI() {
  console.log('Testing AIML API integration...');
  
  if (!process.env.AIML_API_KEY || process.env.AIML_API_KEY === 'your-aiml-api-key-here') {
    console.error('❌ AIML_API_KEY not set in .env file');
    console.log('Please add your AIML API key to the .env file:');
    console.log('AIML_API_KEY=your-actual-api-key');
    return;
  }
  
  try {
    const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIML_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message. Please respond with "API connection successful".'
          }
        ],
        max_tokens: 50,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ AIML API Response:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('✅ API connection successful!');
      console.log('Response:', data.choices[0].message.content);
    } else {
      console.log('⚠️ Unexpected response format');
    }
    
  } catch (error) {
    console.error('❌ AIML API Error:', error.message);
    console.log('Please check:');
    console.log('1. Your API key is correct');
    console.log('2. You have internet connection');
    console.log('3. The AIML API service is available');
  }
}

// Run the test
testAIMLAPI();