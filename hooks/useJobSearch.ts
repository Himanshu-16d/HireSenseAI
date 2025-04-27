import { useEffect, useState, useCallback } from 'react';
import type { Job, JobSearchParams } from '@/types/job';

export const useJobSearch = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initializeTopics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs', {
          method: 'POST'
        });
        
        if (!response.ok) {
          throw new Error('Failed to initialize topics');
        }
        
        setConnected(true);
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize topics:', err);
        setError('Failed to connect to job search service');
        setConnected(false);
        setLoading(false);
      }
    };

    initializeTopics();
  }, []);

  const searchJobs = useCallback(async (params: JobSearchParams) => {
    try {
      if (!connected) {
        throw new Error('Not connected to job search service');
      }

      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params.title) queryParams.append('title', params.title);
      if (params.location) queryParams.append('location', params.location);
      if (params.keywords) queryParams.append('keywords', params.keywords);

      const response = await fetch(`/api/jobs?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }

      const job = await response.json();
      setJobs(prevJobs => {
        const index = prevJobs.findIndex(j => j.id === job.id);
        if (index === -1) {
          return [...prevJobs, job];
        }
        const newJobs = [...prevJobs];
        newJobs[index] = job;
        return newJobs;
      });
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search jobs');
    } finally {
      setLoading(false);
    }
  }, [connected]);

  return {
    jobs,
    loading,
    error,
    connected,
    searchJobs,
  };
};
