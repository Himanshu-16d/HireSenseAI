import fetch from 'node-fetch';

// Helper function to format salary information
function formatSalaryInfo(job) {
  // Priority order for salary information
  if (job.job_salary_range) {
    return job.job_salary_range;
  }
  
  if (job.job_min_salary && job.job_max_salary) {
    const currency = job.job_salary_currency || '';
    const period = job.job_salary_period ? ` per ${job.job_salary_period}` : '';
    return `${currency} ${job.job_min_salary} - ${job.job_max_salary}${period}`.trim();
  }
  
  if (job.job_min_salary) {
    const currency = job.job_salary_currency || '';
    const period = job.job_salary_period ? ` per ${job.job_salary_period}` : '';
    return `${currency} ${job.job_min_salary}+${period}`.trim();
  }
  
  if (job.job_max_salary) {
    const currency = job.job_salary_currency || '';
    const period = job.job_salary_period ? ` per ${job.job_salary_period}` : '';
    return `Up to ${currency} ${job.job_max_salary}${period}`.trim();
  }
  
  if (job.job_salary_currency) {
    return `${job.job_salary_currency} - Salary not disclosed`;
  }
  
  // Check for other potential salary fields
  if (job.estimated_salaries && job.estimated_salaries.length > 0) {
    return `Est: ${job.estimated_salaries[0].salary_range || 'Contact for details'}`;
  }
  
  return 'Salary not disclosed';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    title = '', 
    location = 'India', 
    keywords = '',
    page = 1,
    pageSize = 10,
    numPages = 1
  } = req.body;
  
  // Combine title and keywords for the search query
  const searchQuery = [title, keywords].filter(Boolean).join(' ');
  
  if (!searchQuery.trim()) {
    return res.status(400).json({ 
      success: false, 
      error: 'Search query is required' 
    });
  }

  // Force location to India if not specified, but allow specific Indian cities
  const searchLocation = location || 'India';
  
  // Calculate how many pages to fetch from RapidAPI to get enough jobs
  // RapidAPI typically returns 10 jobs per page, so we need to fetch multiple pages
  // For better user experience, let's fetch more pages to have a larger pool of jobs
  const minJobsNeeded = Math.max(50, pageSize * 3); // Ensure we have at least 50 jobs or 3x the page size
  const apiPagesToFetch = Math.min(10, Math.ceil(minJobsNeeded / 10)); // Limit to 10 pages max to avoid API limits
  
  // Build search URL with proper location handling
  // If user specifies a specific Indian city, use it directly in the query
  let searchQueryWithLocation = searchQuery;
  if (searchLocation !== 'India' && searchLocation.toLowerCase().includes('india') === false) {
    // Add India to the location if it's not already included
    searchQueryWithLocation = `${searchQuery} ${searchLocation} India`;
  } else if (searchLocation !== 'India') {
    // Use the location as provided (e.g., "Delhi, India" or "Mumbai, India")
    searchQueryWithLocation = `${searchQuery} ${searchLocation}`;
  }
  
  // Use both query and location parameters for better filtering
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQueryWithLocation)}&page=1&num_pages=${apiPagesToFetch}&country=IN&location=${encodeURIComponent(searchLocation)}`;

  try {
    console.log(`Making RapidAPI request for India jobs (Page ${page}, Size ${pageSize}):`, url);
    
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
      // Filter jobs to ensure they are from India and match the specified location
      const indiaJobs = data.data.filter(job => {
        const jobLocation = job.job_country || '';
        const jobCity = job.job_city || '';
        const jobState = job.job_state || '';
        const fullJobLocation = `${jobCity} ${jobState} ${jobLocation}`.toLowerCase();
        
        // First check if the job is from India
        const isIndiaJob = jobLocation.toLowerCase().includes('india') || 
                          jobLocation.toLowerCase().includes('in') ||
                          jobCity.toLowerCase().includes('india') ||
                          jobState.toLowerCase().includes('india') ||
                          job.job_country === 'IN';
        
        if (!isIndiaJob) {
          return false;
        }
        
        // If user specified a specific location (not just "India"), filter by that location
        if (searchLocation.toLowerCase() !== 'india') {
          const searchLocationLower = searchLocation.toLowerCase();
          const locationKeywords = searchLocationLower.split(/[,\s]+/).filter(word => 
            word.length > 2 && !['india', 'in'].includes(word)
          );
          
          // Check if any of the location keywords match the job location
          if (locationKeywords.length > 0) {
            const hasLocationMatch = locationKeywords.some(keyword => 
              fullJobLocation.includes(keyword) ||
              jobCity.toLowerCase().includes(keyword) ||
              jobState.toLowerCase().includes(keyword)
            );
            
            return hasLocationMatch;
          }
        }
        
        return true; // Include all India jobs if no specific location filtering
      });
      
      console.log(`Filtered ${indiaJobs.length} jobs from India out of ${data.data.length} total jobs`);
      
      // Transform RapidAPI response to match our Job interface
      const allJobs = indiaJobs.map(job => ({
        id: job.job_id || Math.random().toString(36).substr(2, 9),
        title: job.job_title || 'N/A',
        company: job.employer_name || 'N/A',
        location: job.job_city && job.job_state ? 
          `${job.job_city}, ${job.job_state}, India` : 
          (job.job_city ? `${job.job_city}, India` : 'India'),
        description: job.job_description || 'No description available',
        url: job.job_apply_link || '#',
        postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
        salary: formatSalaryInfo(job),
        skills: job.job_required_skills || [],
        matchScore: 85, // Default match score
        source: 'RapidAPI JSsearch',
        commuteTime: 0,
        distance: 0
      }));
      
      // Implement pagination on the transformed jobs
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedJobs = allJobs.slice(startIndex, endIndex);
      
      // Calculate pagination info
      const totalJobs = allJobs.length;
      const totalPages = Math.ceil(totalJobs / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      res.status(200).json({
        success: true,
        jobs: paginatedJobs,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalJobs: totalJobs,
          totalPages: totalPages,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          startIndex: startIndex + 1,
          endIndex: Math.min(endIndex, totalJobs)
        },
        message: `Found ${totalJobs} jobs in India (Page ${page} of ${totalPages})`
      });
    } else {
      console.log('No jobs found or API error:', data);
      res.status(200).json({
        success: false,
        jobs: [],
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalJobs: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          startIndex: 0,
          endIndex: 0
        },
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