import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title = '', location = 'India', keywords = '' } = req.body;
  
  // Combine title and keywords for the search query
  const searchQuery = [title, keywords].filter(Boolean).join(' ');
  
  if (!searchQuery.trim()) {
    return res.status(400).json({ 
      success: false, 
      error: 'Search query is required' 
    });
  }

  // Force location to India if not specified or set to India
  const searchLocation = location || 'India';
  
  // Use both query and location parameters for better filtering
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1&country=IN&location=${encodeURIComponent(searchLocation)}`;

  try {
    console.log('Making RapidAPI request for India jobs:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });
    
    if (!response.ok) {
      throw new Error(`RapidAPI request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('RapidAPI response status:', data.status);
    
    if (data.status === 'OK' && data.data && data.data.length > 0) {
      // Filter jobs to ensure they are from India
      const indiaJobs = data.data.filter(job => {
        const jobLocation = job.job_country || '';
        const jobCity = job.job_city || '';
        const jobState = job.job_state || '';
        
        // Check if the job is from India
        return jobLocation.toLowerCase().includes('india') || 
               jobLocation.toLowerCase().includes('in') ||
               jobCity.toLowerCase().includes('india') ||
               jobState.toLowerCase().includes('india') ||
               job.job_country === 'IN';
      });
      
      console.log(`Filtered ${indiaJobs.length} jobs from India out of ${data.data.length} total jobs`);
      
      // Transform RapidAPI response to match our Job interface
      const jobs = indiaJobs.map(job => ({
        id: job.job_id || Math.random().toString(36).substr(2, 9),
        title: job.job_title || 'N/A',
        company: job.employer_name || 'N/A',
        location: job.job_city && job.job_state ? 
          `${job.job_city}, ${job.job_state}, India` : 
          (job.job_city ? `${job.job_city}, India` : 'India'),
        description: job.job_description || 'No description available',
        url: job.job_apply_link || '#',
        postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
        salary: job.job_salary_range || 'Salary not disclosed',
        skills: job.job_required_skills || [],
        matchScore: 85, // Default match score
        source: 'RapidAPI JSsearch',
        commuteTime: 0,
        distance: 0
      }));
      
      res.status(200).json({
        success: true,
        jobs: jobs,
        total: jobs.length,
        message: `Found ${jobs.length} jobs in India`
      });
    } else {
      console.log('No jobs found or API error:', data);
      res.status(200).json({
        success: false,
        jobs: [],
        error: 'No jobs found in India'
      });
    }
  } catch (error) {
    console.error('RapidAPI error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch jobs from India' 
    });
  }
}