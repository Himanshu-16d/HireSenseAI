import fetch from 'node-fetch';

// Helper function to format salary information from Adzuna
function formatSalaryInfo(job) {
  // Adzuna provides salary_min and salary_max
  if (job.salary_min && job.salary_max) {
    const currency = job.currency || '₹';
    return `${currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} per year`;
  }
  
  if (job.salary_min) {
    const currency = job.currency || '₹';
    return `${currency} ${job.salary_min.toLocaleString()}+ per year`;
  }
  
  if (job.salary_max) {
    const currency = job.currency || '₹';
    return `Up to ${currency} ${job.salary_max.toLocaleString()} per year`;
  }
  
  // Check for salary in description as fallback
  if (job.description) {
    const salaryMatch = job.description.match(/(?:₹|rs\.?|rupees?|inr)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakh|lac|k|thousand)?/i);
    if (salaryMatch) {
      return `₹ ${salaryMatch[1]} (from description)`;
    }
  }
  
  return 'Salary not disclosed';
}

// Helper function to extract skills from job description
function extractSkills(description) {
  if (!description) return [];
  
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'express',
    'mongodb', 'mysql', 'postgresql', 'html', 'css', 'typescript', 'php', 'laravel',
    'django', 'spring', 'kubernetes', 'docker', 'aws', 'azure', 'gcp', 'git',
    'jenkins', 'terraform', 'ansible', 'linux', 'windows', 'api', 'rest', 'graphql',
    'machine learning', 'data science', 'ai', 'sql', 'nosql', 'redis', 'kafka',
    'microservices', 'devops', 'ci/cd', 'testing', 'selenium', 'jest', 'cypress'
  ];
  
  const foundSkills = [];
  const descriptionLower = description.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (descriptionLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills.slice(0, 10); // Limit to 10 skills
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
  
  // Adzuna API configuration
  const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
  const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
  
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Adzuna API credentials not configured'
    });
  }

  // Calculate how many results to fetch from Adzuna
  // Adzuna allows up to 50 results per page
  const resultsPerPage = Math.min(50, pageSize * 3); // Get more results to have a good pool for filtering
  
  // Build Adzuna API URL for India
  // Adzuna country code for India is 'in'
  let adzunaLocation = '';
  if (searchLocation.toLowerCase() !== 'india') {
    // If user specified a specific city, include it in the location filter
    adzunaLocation = `&where=${encodeURIComponent(searchLocation)}`;
  }
  
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?` +
    `app_id=${ADZUNA_APP_ID}` +
    `&app_key=${ADZUNA_APP_KEY}` +
    `&results_per_page=${resultsPerPage}` +
    `&what=${encodeURIComponent(searchQuery)}` +
    adzunaLocation +
    `&content-type=application/json`;

  try {
    console.log(`Making Adzuna API request for India jobs (Page ${page}, Size ${pageSize}):`, url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Adzuna API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Adzuna API response:', {
      count: data.count,
      resultsFound: data.results?.length || 0
    });
    
    if (data.results && data.results.length > 0) {
      // Filter jobs to ensure they are from India and match the specified location
      const indiaJobs = data.results.filter(job => {
        const jobLocation = job.location?.display_name || '';
        const jobAreaList = job.location?.area || [];
        
        // Build a comprehensive location string for filtering
        const allLocationInfo = [
          jobLocation,
          ...jobAreaList
        ].join(' ').toLowerCase();
        
        // Ensure the job is from India
        const isIndiaJob = allLocationInfo.includes('india') || 
                          allLocationInfo.includes('bharath') ||
                          allLocationInfo.includes('bharat');
        
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
              allLocationInfo.includes(keyword)
            );
            
            return hasLocationMatch;
          }
        }
        
        return true; // Include all India jobs if no specific location filtering
      });
      
      console.log(`Filtered ${indiaJobs.length} jobs from India out of ${data.results.length} total jobs`);
      
      // Transform Adzuna response to match our Job interface
      const allJobs = indiaJobs.map(job => ({
        id: job.id || Math.random().toString(36).substr(2, 9),
        title: job.title || 'N/A',
        company: job.company?.display_name || 'N/A',
        location: job.location?.display_name || 'India',
        description: job.description || 'No description available',
        url: job.redirect_url || job.url || '#',
        postedDate: job.created || new Date().toISOString(),
        salary: formatSalaryInfo(job),
        skills: extractSkills(job.description),
        matchScore: 85, // Default match score
        source: 'Adzuna',
        commuteTime: 0,
        distance: 0,
        category: job.category?.label || 'General',
        contract_type: job.contract_type || 'Not specified'
      }));
      
      // Implement pagination on the transformed jobs
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedJobs = allJobs.slice(startIndex, endIndex);
      
      // Calculate pagination info
      const totalJobs = Math.min(data.count || allJobs.length, allJobs.length);
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
        source: 'Adzuna API'
      });
    } else {
      console.log('No jobs found from Adzuna API');
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
        error: 'No jobs found in India',
        source: 'Adzuna API'
      });
    }
  } catch (error) {
    console.error('Adzuna API error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch jobs from India',
      source: 'Adzuna API'
    });
  }
}