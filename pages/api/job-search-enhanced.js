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

// Helper function to make RapidAPI request
async function fetchJobsFromRapidAPI(searchQuery, searchLocation, numPages = 5) {
  // Build search query with location if it's not just "India"
  let queryWithLocation = searchQuery;
  if (searchLocation !== 'India' && searchLocation.toLowerCase().includes('india') === false) {
    // Add India to the location if it's not already included
    queryWithLocation = `${searchQuery} ${searchLocation} India`;
  } else if (searchLocation !== 'India') {
    // Use the location as provided (e.g., "Delhi, India" or "Mumbai, India")
    queryWithLocation = `${searchQuery} ${searchLocation}`;
  }
  
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(queryWithLocation)}&page=1&num_pages=${numPages}&country=IN&location=${encodeURIComponent(searchLocation)}`;
  
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
  return data;
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
    enhanced = false
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
  
  try {
    console.log(`Making enhanced RapidAPI request for India jobs (Page ${page}, Size ${pageSize})`);
    
    let allJobsData = [];
    
    if (enhanced && pageSize > 10) {
      // For larger page sizes, make multiple diverse searches
      const baseSearches = [
        searchQuery,
        `${title} ${searchLocation}`,
        `${keywords} jobs ${searchLocation}`,
        `${title} developer ${searchLocation}`,
        `${title} engineer ${searchLocation}`
      ];
      
      // If location is not just "India", add more location-specific variations
      if (searchLocation.toLowerCase() !== 'india') {
        baseSearches.push(
          `${searchQuery} in ${searchLocation}`,
          `${title} ${searchLocation} India`,
          `${keywords} ${searchLocation} jobs`
        );
      }
      
      const searchVariations = baseSearches
        .filter((query, index, arr) => arr.indexOf(query) === index && query.trim()) // Remove duplicates and empty queries
        .filter(query => query.length > 3); // Remove too short queries
      
      console.log('Using location-aware search variations:', searchVariations);
      
      // Fetch from multiple search queries to get more diverse results
      const fetchPromises = searchVariations.slice(0, 3).map(async (query) => {
        try {
          const data = await fetchJobsFromRapidAPI(query, searchLocation, 5);
          return data.data || [];
        } catch (error) {
          console.warn(`Failed to fetch jobs for query "${query}":`, error.message);
          return [];
        }
      });
      
      const resultsArray = await Promise.all(fetchPromises);
      allJobsData = resultsArray.flat();
    } else {
      // Standard single search
      const numPages = Math.min(10, Math.max(5, Math.ceil(pageSize / 10)));
      const data = await fetchJobsFromRapidAPI(searchQuery, searchLocation, numPages);
      allJobsData = data.data || [];
    }
    
    if (allJobsData.length > 0) {
      // Filter jobs to ensure they are from India and remove duplicates
      const seenJobIds = new Set();
      const indiaJobs = allJobsData.filter(job => {
        // Remove duplicates
        if (seenJobIds.has(job.job_id)) {
          return false;
        }
        seenJobIds.add(job.job_id);
        
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
      
      console.log(`Filtered ${indiaJobs.length} unique jobs from India out of ${allJobsData.length} total jobs`);
      
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
        message: `Found ${totalJobs} jobs in India (Page ${page} of ${totalPages})`,
        enhanced: enhanced
      });
    } else {
      console.log('No jobs found');
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
