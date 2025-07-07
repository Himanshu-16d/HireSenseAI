// Test API endpoint to check RapidAPI connection
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = `https://jsearch.p.rapidapi.com/search?query=software%20engineer&page=1&num_pages=1`;
  
  try {
    console.log('Testing RapidAPI connection...');
    console.log('URL:', url);
    console.log('API Key exists:', !!process.env.RAPIDAPI_KEY);
    console.log('API Host:', process.env.RAPIDAPI_HOST);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', {
      status: data.status,
      dataLength: data.data ? data.data.length : 0,
      hasParameters: !!data.parameters,
      requestId: data.request_id
    });
    
    if (data.status === 'OK') {
      res.status(200).json({
        success: true,
        message: 'RapidAPI is working correctly!',
        jobsFound: data.data ? data.data.length : 0,
        sampleJob: data.data && data.data.length > 0 ? {
          id: data.data[0].job_id,
          title: data.data[0].job_title,
          company: data.data[0].employer_name,
          location: data.data[0].job_city
        } : null
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'RapidAPI returned non-OK status',
        status: data.status,
        error: data.error || 'Unknown error'
      });
    }
    
  } catch (error) {
    console.error('RapidAPI test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}
