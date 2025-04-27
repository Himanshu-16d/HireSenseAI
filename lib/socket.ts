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
        // Simulate job search (replace with actual job search logic)
        const mockJobs: Job[] = [
          {
            id: '1',
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'Remote',
            description: 'Looking for a skilled software engineer...',
            url: 'https://example.com/job/1',
            postedDate: new Date().toISOString(),
            salary: '$100,000 - $150,000',
            skills: ['JavaScript', 'TypeScript', 'React'],
            matchScore: 0.85,
            source: 'linkedin',
            commuteTime: 0,
            distance: 0
          },
          {
            id: '2',
            title: 'Frontend Developer',
            company: 'Web Solutions',
            location: 'New York',
            description: 'Seeking an experienced frontend developer...',
            url: 'https://example.com/job/2',
            postedDate: new Date().toISOString(),
            salary: '$90,000 - $130,000',
            skills: ['React', 'Vue', 'CSS'],
            matchScore: 0.75,
            source: 'indeed',
            commuteTime: 30,
            distance: 5
          }
        ];

        // Send initial results
        socket.emit('job-results', mockJobs);

        // Simulate real-time updates
        const updateInterval = setInterval(() => {
          const newJob: Job = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Job ' + Math.floor(Math.random() * 1000),
            company: 'Company ' + Math.floor(Math.random() * 1000),
            location: 'Remote',
            description: 'New job opportunity...',
            url: 'https://example.com/job/new',
            postedDate: new Date().toISOString(),
            salary: '$80,000 - $120,000',
            skills: ['JavaScript', 'React', 'Node.js'],
            matchScore: Math.random(),
            source: 'other',
            commuteTime: 0,
            distance: 0
          };
          socket.emit('job-update', newJob);
        }, 5000);

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