// Test script to check RapidAPI integration
const fetch = require('node-fetch');
require('dotenv').config();

async function testRapidAPI() {
  const url = `https://jsearch.p.rapidapi.com/search?query=software%20engineer&page=1&num_pages=1`;
  
  try {
    console.log('Testing RapidAPI connection...');
    console.log('URL:', url);
    console.log('API Key:', process.env.RAPIDAPI_KEY ? 'Set' : 'Missing');
    console.log('API Host:', process.env.RAPIDAPI_HOST);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data structure:', {
      status: data.status,
      dataLength: data.data ? data.data.length : 0,
      hasParameters: !!data.parameters,
      firstJob: data.data && data.data.length > 0 ? {
        id: data.data[0].job_id,
        title: data.data[0].job_title,
        company: data.data[0].employer_name,
        location: data.data[0].job_city
      } : null
    });
    
    if (data.status === 'OK') {
      console.log('✅ RapidAPI is working correctly!');
      console.log(`Found ${data.data.length} jobs`);
    } else {
      console.log('❌ RapidAPI returned non-OK status:', data.status);
    }
    
  } catch (error) {
    console.error('❌ RapidAPI test failed:', error.message);
  }
}

testRapidAPI();
