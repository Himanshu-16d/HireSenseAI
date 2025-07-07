// Manual test of job search API endpoint
async function testJobSearchAPI() {
  try {
    console.log('Testing job search API...');
    
    const testPayload = {
      title: 'software engineer',
      location: 'India',
      keywords: 'JavaScript, React'
    };
    
    console.log('Test payload:', testPayload);
    
    const response = await fetch('http://localhost:3001/api/job-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Response data:', {
      success: data.success,
      jobsCount: data.jobs ? data.jobs.length : 0,
      error: data.error,
      sampleJob: data.jobs && data.jobs.length > 0 ? {
        id: data.jobs[0].id,
        title: data.jobs[0].title,
        company: data.jobs[0].company,
        location: data.jobs[0].location
      } : null
    });
    
    if (data.success) {
      console.log('✅ Job search API is working!');
    } else {
      console.log('❌ Job search API returned error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Job search API test failed:', error.message);
  }
}

// Note: This would need to be run when the server is running
console.log('Job search API test ready. Run this when server is running at localhost:3001');
