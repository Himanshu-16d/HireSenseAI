// Comprehensive RapidAPI Diagnostic Test
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {},
    rapidApiTest: {},
    jobSearchTest: {}
  };

  try {
    // 1. Environment Check
    diagnostics.environment = {
      rapidApiKeyExists: !!process.env.RAPIDAPI_KEY,
      rapidApiKeyLength: process.env.RAPIDAPI_KEY ? process.env.RAPIDAPI_KEY.length : 0,
      rapidApiHost: process.env.RAPIDAPI_HOST || 'Missing',
      nodeEnv: process.env.NODE_ENV || 'undefined'
    };

    // 2. Basic RapidAPI Test with India filter
    const rapidApiUrl = 'https://jsearch.p.rapidapi.com/search?query=software%20engineer&page=1&num_pages=1&country=IN&location=India';
    
    try {
      console.log('Testing RapidAPI connection...');
      const rapidResponse = await fetch(rapidApiUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
        },
      });

      diagnostics.rapidApiTest = {
        status: rapidResponse.status,
        ok: rapidResponse.ok,
        headers: Object.fromEntries(rapidResponse.headers.entries())
      };

      if (rapidResponse.ok) {
        const data = await rapidResponse.json();
        diagnostics.rapidApiTest.response = {
          status: data.status,
          requestId: data.request_id,
          dataCount: data.data ? data.data.length : 0,
          hasData: !!data.data,
          sampleJob: data.data && data.data.length > 0 ? {
            id: data.data[0].job_id,
            title: data.data[0].job_title,
            company: data.data[0].employer_name,
            location: data.data[0].job_city,
            // Salary information fields
            salary_range: data.data[0].job_salary_range,
            min_salary: data.data[0].job_min_salary,
            max_salary: data.data[0].job_max_salary,
            salary_currency: data.data[0].job_salary_currency,
            salary_period: data.data[0].job_salary_period,
            // All available fields for debugging
            availableFields: Object.keys(data.data[0]).filter(key => key.includes('salary'))
          } : null
        };
      } else {
        const errorText = await rapidResponse.text();
        diagnostics.rapidApiTest.error = errorText;
      }
    } catch (error) {
      diagnostics.rapidApiTest.error = error.message;
    }

    // 3. Job Search API Test
    try {
      const testPayload = {
        title: 'software engineer',
        location: 'India',
        keywords: 'JavaScript'
      };

      // Test the job search logic directly
      const searchQuery = [testPayload.title, testPayload.keywords].filter(Boolean).join(' ');
      const jobSearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1`;
      
      const jobResponse = await fetch(jobSearchUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
        },
      });

      diagnostics.jobSearchTest = {
        searchQuery,
        url: jobSearchUrl,
        status: jobResponse.status,
        ok: jobResponse.ok
      };

      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        diagnostics.jobSearchTest.response = {
          status: jobData.status,
          jobsFound: jobData.data ? jobData.data.length : 0,
          transformedJobs: jobData.data ? jobData.data.map(job => ({
            id: job.job_id,
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : job.job_country
          })).slice(0, 3) : []
        };
      } else {
        const errorText = await jobResponse.text();
        diagnostics.jobSearchTest.error = errorText;
      }
    } catch (error) {
      diagnostics.jobSearchTest.error = error.message;
    }

    // 4. Overall Assessment
    const isWorking = diagnostics.rapidApiTest.response?.status === 'OK' && 
                     diagnostics.jobSearchTest.response?.status === 'OK';

    diagnostics.assessment = {
      isWorking,
      issues: [],
      recommendations: []
    };

    if (!diagnostics.environment.rapidApiKeyExists) {
      diagnostics.assessment.issues.push('RapidAPI key is missing');
      diagnostics.assessment.recommendations.push('Set RAPIDAPI_KEY environment variable');
    }

    if (diagnostics.environment.rapidApiHost !== 'jsearch.p.rapidapi.com') {
      diagnostics.assessment.issues.push('RapidAPI host is incorrect');
      diagnostics.assessment.recommendations.push('Set RAPIDAPI_HOST to jsearch.p.rapidapi.com');
    }

    if (!isWorking) {
      diagnostics.assessment.issues.push('RapidAPI is not responding correctly');
      diagnostics.assessment.recommendations.push('Check RapidAPI subscription status and API key validity');
    }

    res.status(200).json(diagnostics);

  } catch (error) {
    diagnostics.globalError = error.message;
    res.status(500).json(diagnostics);
  }
}
