import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

const redis: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const initializeRedis = async () => {
  try {
    await redis.connect();
    console.log('Connected to Redis');
    return redis;
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    throw error;
  }
};

export const publishJobListing = async (redis: RedisClientType, job: any) => {
  try {
    await redis.publish('job-listings', JSON.stringify(job));
    console.log('Published job listing:', job.id);
  } catch (error) {
    console.error('Error publishing job listing:', error);
    throw error;
  }
};

export const subscribeToJobListings = async (redis: RedisClientType, callback: (job: any) => void) => {
  try {
    const subscriber = redis.duplicate();
    await subscriber.connect();
    
    await subscriber.subscribe('job-listings', (message: string) => {
      const job = JSON.parse(message);
      callback(job);
    });
    
    return subscriber;
  } catch (error) {
    console.error('Error subscribing to job listings:', error);
    throw error;
  }
};

export default redis; 