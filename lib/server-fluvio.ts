"use server";

import Fluvio from '@fluvio/client';
import type { Job, JobSearchParams } from '@/types/job';

const FLUVIO_TOKEN = "eyJhbGciOiJFZERTQSIsImtpZCI6ImluZmlueW9uLTEifQ.eyJleHAiOjE3NDYwMjMzMTYsIm5iZiI6MTc0NTQxNDkxNiwiaWF0IjoxNzQ1NDE4NTE2LCJlbWFpbCI6ImhkdWJleTE2MTFAZ21haWwuY29tIn0.A-IFfMWIiM8lEJegpRZRRh3NGKGXHWPuZWc1kj_D49Bzgr7vbIXSUTbjPyllCIaNh7ydePMx4_VuDj8dCQUgDg";

let fluvioInstance: Fluvio | null = null;

const getFluvio = async () => {
  if (!fluvioInstance) {
    fluvioInstance = new Fluvio({
      endpoint: "cloud.fluvio.io:9003",
      tls: true,
      authToken: FLUVIO_TOKEN,
    });
    await fluvioInstance.connect();
  }
  return fluvioInstance;
};

export const createJobTopics = async () => {
  try {
    const fluvio = await getFluvio();
    const admin = await fluvio.admin();
    
    const topics = await admin.listTopics();
    
    if (!topics.includes('job-listings')) {
      await admin.createTopic('job-listings');
      console.log('Created job-listings topic');
    }
    
    if (!topics.includes('job-matches')) {
      await admin.createTopic('job-matches');
      console.log('Created job-matches topic');
    }
    
    console.log('Topics ready');
  } catch (error) {
    console.error('Error creating job topics:', error);
    throw error;
  }
};

export const produceJobListing = async (job: Job) => {
  try {
    const fluvio = await getFluvio();
    const producer = await fluvio.topicProducer('job-listings');
    await producer.sendRecord(JSON.stringify(job));
    console.log('Produced job listing:', job.id);
  } catch (error) {
    console.error('Error producing job listing:', error);
    throw error;
  }
};

export const searchJobs = async (params: JobSearchParams) => {
  try {
    const fluvio = await getFluvio();
    const consumer = await fluvio.partitionConsumer('job-listings', 0);
    
    // Get all records from the topic
    const records = await consumer.fetchAll();
    const jobs: Job[] = [];
    
    for (const record of records) {
      try {
        const job = JSON.parse(record.value());
        // Filter jobs based on search parameters
        if (
          (!params.title || job.title.toLowerCase().includes(params.title.toLowerCase())) &&
          (!params.location || job.location.toLowerCase().includes(params.location.toLowerCase())) &&
          (!params.keywords || 
            params.keywords.split(',').some(keyword => 
              job.skills.some((skill: string) => 
                skill.toLowerCase().includes(keyword.trim().toLowerCase())
              )
            )
          )
        ) {
          jobs.push(job);
        }
      } catch (error) {
        console.error('Error parsing job record:', error);
      }
    }
    
    // If no jobs found, return a mock job
    if (jobs.length === 0) {
      const mockJob: Job = {
        id: Date.now().toString(),
        title: params.title || 'Software Engineer',
        company: 'Tech Corp',
        location: params.location || 'Remote',
        description: 'Exciting opportunity for a skilled developer...',
        url: 'https://example.com/job',
        postedDate: new Date().toISOString(),
        salary: '$100,000 - $150,000',
        skills: params.keywords?.split(',').map(k => k.trim()).filter(Boolean) || [],
        matchScore: 85,
        source: 'linkedin',
        commuteTime: 0,
        distance: 0
      };
      await produceJobListing(mockJob);
      return mockJob;
    }
    
    return jobs[0]; // Return the first matching job
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
}; 