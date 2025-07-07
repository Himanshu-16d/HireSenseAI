import { Server } from 'socket.io';
import { Job, JobSearchParams } from '@/types/job';

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', async (socket) => {
    console.log('Client connected');

    // Subscribe to job search updates
    socket.on('search-jobs', async (searchParams: JobSearchParams) => {
      try {
        // Use real job search instead of mock data
        const { searchJobs } = await import('@/lib/job-service');
        const jobs = await searchJobs(searchParams);

        // Send initial results
        socket.emit('job-results', jobs);

        // For real-time updates, you could periodically re-search
        // or implement a job feed subscription system
        const updateInterval = setInterval(async () => {
          try {
            const updatedJobs = await searchJobs(searchParams);
            if (updatedJobs.length > jobs.length) {
              // Send new jobs if found
              const newJobs = updatedJobs.slice(jobs.length);
              newJobs.forEach(job => socket.emit('job-update', job));
            }
          } catch (error) {
            console.error('Error in periodic job update:', error);
          }
        }, 30000); // Check for updates every 30 seconds

        // Clean up interval on disconnect
        socket.on('disconnect', () => {
          clearInterval(updateInterval);
          console.log('Client disconnected');
        });
      } catch (error) {
        console.error('Error in job search:', error);
        socket.emit('search-error', { message: 'Error performing job search' });
      }
    });
  });

  return io;
}; 