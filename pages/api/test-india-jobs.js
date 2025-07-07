// Test script to verify India location filtering
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Search with India location
  try {
    console.log('Testing India location filtering...');
    
    const testPayload = {
      title: 'software engineer',
      location: 'India',
      keywords: 'JavaScript'
    };

    const response = await fetch(`${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/job-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const data = await response.json();
      results.tests.push({
        name: 'India Location Filter',
        success: data.success,
        jobsFound: data.jobs ? data.jobs.length : 0,
        locations: data.jobs ? data.jobs.map(job => job.location).slice(0, 5) : [],
        message: data.message || 'No message'
      });
    } else {
      results.tests.push({
        name: 'India Location Filter',
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'India Location Filter',
      success: false,
      error: error.message
    });
  }

  // Test 2: Search with specific Indian city
  try {
    console.log('Testing specific Indian city filtering...');
    
    const testPayload = {
      title: 'software engineer',
      location: 'Mumbai, India',
      keywords: 'React'
    };

    const response = await fetch(`${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/job-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      const data = await response.json();
      results.tests.push({
        name: 'Mumbai India Filter',
        success: data.success,
        jobsFound: data.jobs ? data.jobs.length : 0,
        locations: data.jobs ? data.jobs.map(job => job.location).slice(0, 5) : [],
        message: data.message || 'No message'
      });
    } else {
      results.tests.push({
        name: 'Mumbai India Filter',
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'Mumbai India Filter',
      success: false,
      error: error.message
    });
  }

  // Test 3: Direct RapidAPI call with India filter
  try {
    console.log('Testing direct RapidAPI call with India filter...');
    
    const rapidApiUrl = `https://jsearch.p.rapidapi.com/search?query=software%20engineer&page=1&num_pages=1&country=IN&location=India`;
    
    const response = await fetch(rapidApiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const indiaJobs = data.data ? data.data.filter(job => {
        const jobLocation = job.job_country || '';
        const jobCity = job.job_city || '';
        const jobState = job.job_state || '';
        
        return jobLocation.toLowerCase().includes('india') || 
               jobLocation.toLowerCase().includes('in') ||
               jobCity.toLowerCase().includes('india') ||
               jobState.toLowerCase().includes('india') ||
               job.job_country === 'IN';
      }) : [];

      results.tests.push({
        name: 'Direct RapidAPI India Filter',
        success: data.status === 'OK',
        totalJobs: data.data ? data.data.length : 0,
        indiaJobs: indiaJobs.length,
        sampleLocations: indiaJobs.slice(0, 5).map(job => ({
          city: job.job_city,
          state: job.job_state,
          country: job.job_country
        }))
      });
    } else {
      results.tests.push({
        name: 'Direct RapidAPI India Filter',
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'Direct RapidAPI India Filter',
      success: false,
      error: error.message
    });
  }

  // Summary
  const successfulTests = results.tests.filter(test => test.success).length;
  const totalTests = results.tests.length;
  
  results.summary = {
    successfulTests,
    totalTests,
    allTestsPassed: successfulTests === totalTests,
    recommendations: []
  };

  if (successfulTests === totalTests) {
    results.summary.recommendations.push('✅ India location filtering is working correctly!');
  } else {
    results.summary.recommendations.push('❌ Some tests failed. Check individual test results.');
    results.summary.recommendations.push('🔍 Verify RapidAPI key and subscription status.');
    results.summary.recommendations.push('🌐 Check network connectivity to RapidAPI.');
  }

  res.status(200).json(results);
}
