// Simple test to verify environment variables and make a basic fetch request
console.log('Environment Check:');
console.log('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'Set (length: ' + process.env.RAPIDAPI_KEY.length + ')' : 'Missing');
console.log('RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST || 'Missing');

async function testBasicFetch() {
  try {
    // Test basic fetch to a simple API first
    const testResponse = await fetch('https://httpbin.org/get');
    console.log('Basic fetch test:', testResponse.ok ? 'Success' : 'Failed');
    
    // Test RapidAPI
    const rapidApiUrl = 'https://jsearch.p.rapidapi.com/search?query=software%20engineer&page=1&num_pages=1';
    console.log('Testing RapidAPI URL:', rapidApiUrl);
    
    const rapidResponse = await fetch(rapidApiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });
    
    console.log('RapidAPI Response Status:', rapidResponse.status);
    console.log('RapidAPI Response Headers:', Object.fromEntries(rapidResponse.headers.entries()));
    
    if (rapidResponse.ok) {
      const data = await rapidResponse.json();
      console.log('RapidAPI Success! Data structure:', {
        status: data.status,
        dataCount: data.data ? data.data.length : 0,
        hasData: !!data.data
      });
    } else {
      const errorText = await rapidResponse.text();
      console.log('RapidAPI Error Response:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBasicFetch();
