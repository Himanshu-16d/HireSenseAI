// Test script to verify salary information is always displayed
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = {
    timestamp: new Date().toISOString(),
    testType: 'Salary Display Test',
    tests: []
  };

  try {
    console.log('Testing salary display for all jobs...');
    
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
      
      if (data.success && data.jobs) {
        const jobsWithSalary = data.jobs.filter(job => job.salary);
        const jobsWithoutSalary = data.jobs.filter(job => !job.salary);
        
        results.tests.push({
          name: 'Salary Field Presence',
          success: jobsWithoutSalary.length === 0,
          totalJobs: data.jobs.length,
          jobsWithSalary: jobsWithSalary.length,
          jobsWithoutSalary: jobsWithoutSalary.length,
          salaryExamples: data.jobs.slice(0, 5).map(job => ({
            title: job.title,
            company: job.company,
            salary: job.salary
          })),
          message: jobsWithoutSalary.length === 0 ? 
            'All jobs have salary information' : 
            `${jobsWithoutSalary.length} jobs missing salary information`
        });
      } else {
        results.tests.push({
          name: 'Salary Field Presence',
          success: false,
          error: 'No jobs found or API error',
          apiResponse: data
        });
      }
    } else {
      results.tests.push({
        name: 'Salary Field Presence',
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'Salary Field Presence',
      success: false,
      error: error.message
    });
  }

  // Test 2: Verify salary formatting
  try {
    console.log('Testing salary formatting...');
    
    const testPayload = {
      title: 'data scientist',
      location: 'India',
      keywords: 'Python'
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
      
      if (data.success && data.jobs) {
        const salaryFormats = data.jobs.map(job => job.salary).filter(Boolean);
        const uniqueSalaryFormats = [...new Set(salaryFormats)];
        
        results.tests.push({
          name: 'Salary Formatting',
          success: true,
          totalJobs: data.jobs.length,
          uniqueSalaryFormats: uniqueSalaryFormats.slice(0, 10),
          salaryDistribution: {
            disclosed: salaryFormats.filter(s => !s.toLowerCase().includes('not disclosed')).length,
            notDisclosed: salaryFormats.filter(s => s.toLowerCase().includes('not disclosed')).length
          }
        });
      } else {
        results.tests.push({
          name: 'Salary Formatting',
          success: false,
          error: 'No jobs found for salary formatting test'
        });
      }
    } else {
      results.tests.push({
        name: 'Salary Formatting',
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'Salary Formatting',
      success: false,
      error: error.message
    });
  }

  res.status(200).json(results);
}
