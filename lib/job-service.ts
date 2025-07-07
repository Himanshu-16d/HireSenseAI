import type { Job, JobSearchParams } from '@/types/job';

export const searchJobs = async (params: JobSearchParams): Promise<Job[]> => {
  console.log('Searching jobs with params:', params);

  try {
    // Ensure location defaults to India if not specified
    const searchParams = {
      ...params,
      location: params.location || 'India'
    };

    // Make API call to RapidAPI JSsearch for real job data
    const response = await fetch('/api/job-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.jobs) {
      return data.jobs;
    } else {
      console.error('Failed to fetch jobs:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
};

 