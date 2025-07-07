import { useEffect, useState, useCallback } from 'react';
import type { Job, JobSearchParams } from '@/types/job';

export const useJobSearch = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(true); // Always connected for RapidAPI

  const searchJobs = useCallback(async (params: JobSearchParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/job-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }

      const data = await response.json();
      
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
        setError(data.error || 'No jobs found');
      }
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    jobs,
    loading,
    error,
    connected,
    searchJobs,
  };
};
