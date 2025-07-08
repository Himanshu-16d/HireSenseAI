// Test endpoint to verify location-based job search functionality with Adzuna API
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = {
    timestamp: new Date().toISOString(),
    testType: 'Location-Based Job Search Test (Adzuna API)',
    tests: []
  };

  // Test different location searches
  const locationTests = [
    {
      name: 'General India Search',
      params: { title: 'software engineer', location: 'India', keywords: 'JavaScript' }
    },
    {
      name: 'Delhi Specific Search', 
      params: { title: 'software engineer', location: 'Delhi', keywords: 'JavaScript' }
    },
    {
      name: 'Mumbai Specific Search',
      params: { title: 'software engineer', location: 'Mumbai', keywords: 'React' }
    },
    {
      name: 'Bangalore Specific Search',
      params: { title: 'software engineer', location: 'Bangalore', keywords: 'Node.js' }
    },
    {
      name: 'Hyderabad Specific Search',
      params: { title: 'software engineer', location: 'Hyderabad', keywords: 'Python' }
    }
  ];

  for (const test of locationTests) {
    try {
      console.log(`Testing Adzuna location search: ${test.name}`);
      
      const response = await fetch(`${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/job-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.params)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Analyze job locations
        const jobLocations = data.jobs ? data.jobs.map(job => job.location) : [];
        const uniqueLocations = [...new Set(jobLocations)];
        
        // Check if location filtering is working
        const hasExpectedLocation = test.params.location === 'India' || 
          jobLocations.some(loc => loc.toLowerCase().includes(test.params.location.toLowerCase()));

        results.tests.push({
          name: test.name,
          success: data.success,
          searchLocation: test.params.location,
          jobsFound: data.jobs ? data.jobs.length : 0,
          uniqueLocations: uniqueLocations.slice(0, 10), // Show first 10 unique locations
          locationFilterWorking: hasExpectedLocation,
          sampleJobs: data.jobs ? data.jobs.slice(0, 3).map(job => ({
            title: job.title,
            company: job.company,
            location: job.location
          })) : [],
          message: data.message || 'No message'
        });
      } else {
        results.tests.push({
          name: test.name,
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      results.tests.push({
        name: test.name,
        success: false,
        error: error.message
      });
    }
  }

  // Test enhanced search with location
  try {
    console.log('Testing enhanced search with location...');
    
    const enhancedTestParams = {
      title: 'React Developer',
      location: 'Mumbai',
      keywords: 'JavaScript',
      pageSize: 20,
      enhanced: true
    };

    const response = await fetch(`${req.headers.host?.includes('localhost') ? 'http' : 'https'}://${req.headers.host}/api/job-search-enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enhancedTestParams)
    });

    if (response.ok) {
      const data = await response.json();
      
      const jobLocations = data.jobs ? data.jobs.map(job => job.location) : [];
      const uniqueLocations = [...new Set(jobLocations)];
      const mumbaiJobs = jobLocations.filter(loc => loc.toLowerCase().includes('mumbai'));

      results.tests.push({
        name: 'Enhanced Search with Mumbai Location',
        success: data.success,
        enhanced: data.enhanced,
        jobsFound: data.jobs ? data.jobs.length : 0,
        mumbaiJobs: mumbaiJobs.length,
        uniqueLocations: uniqueLocations.slice(0, 10),
        locationFilterWorking: mumbaiJobs.length > 0,
        message: data.message || 'No message'
      });
    } else {
      results.tests.push({
        name: 'Enhanced Search with Mumbai Location',
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'Enhanced Search with Mumbai Location',
      success: false,
      error: error.message
    });
  }

  // Summary
  const successfulTests = results.tests.filter(test => test.success);
  const workingLocationFilters = results.tests.filter(test => test.locationFilterWorking);

  results.summary = {
    totalTests: results.tests.length,
    successfulTests: successfulTests.length,
    workingLocationFilters: workingLocationFilters.length,
    locationSearchWorking: workingLocationFilters.length >= results.tests.length * 0.6, // 60% threshold
    recommendations: []
  };

  if (results.summary.locationSearchWorking) {
    results.summary.recommendations.push('Location-based job search is working correctly');
  } else {
    results.summary.recommendations.push('Location filtering may need improvement');
    results.summary.recommendations.push('Check RapidAPI location parameters and filtering logic');
  }

  res.status(200).json(results);
}
