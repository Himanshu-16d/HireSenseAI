import type { Job, JobSearchParams } from '@/types/job';

export const searchJobs = async (params: JobSearchParams & { page?: number; pageSize?: number }): Promise<{
  jobs: Job[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalJobs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startIndex: number;
    endIndex: number;
  };
}> => {
  console.log('Searching jobs with params:', params);

  try {
    // Ensure location defaults to India if not specified
    const searchParams = {
      ...params,
      location: params.location || 'India',
      page: params.page || 1,
      pageSize: params.pageSize || 10
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
      return {
        jobs: data.jobs,
        pagination: data.pagination
      };
    } else {
      console.error('Failed to fetch jobs:', data.error);
      return {
        jobs: [],
        pagination: {
          currentPage: searchParams.page,
          pageSize: searchParams.pageSize,
          totalJobs: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          startIndex: 0,
          endIndex: 0
        }
      };
    }
  } catch (error) {
    console.error('Error searching jobs:', error);
    return {
      jobs: [],
      pagination: {
        currentPage: params.page || 1,
        pageSize: params.pageSize || 10,
        totalJobs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
        startIndex: 0,
        endIndex: 0
      }
    };
  }
};

 