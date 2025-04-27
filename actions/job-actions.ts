"use server"

import type { Job, JobSearchParams, ResumeData } from "@/types/job"
import { headers } from "next/headers"

export async function findJobs(searchParams: JobSearchParams, resumeData: ResumeData | null): Promise<Job[]> {
  try {
    console.log('Starting job search with params:', searchParams);
    
    // Get the host from headers with fallback
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    
    // Construct the base URL
    const baseUrl = `${protocol}://${host}`;
    
    // Construct the search URL
    const searchUrl = new URL(`${baseUrl}/api/jobs`);
    
    // Add search parameters
    if (searchParams.title) searchUrl.searchParams.append('title', searchParams.title);
    if (searchParams.location) searchUrl.searchParams.append('location', searchParams.location);
    if (searchParams.keywords) searchUrl.searchParams.append('keywords', searchParams.keywords);

    console.log('Fetching jobs from URL:', searchUrl.toString());
    
    const response = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search jobs: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received job data:', data);
    
    if (!data.jobs) {
      console.warn('No jobs array in response:', data);
      return [];
    }

    console.log('Returning jobs:', data.jobs);
    return data.jobs;
  } catch (error) {
    console.error("Error finding jobs:", error);
    return [];
  }
}

// Helper function to generate mock job listings
function getMockJobListings(): Job[] {
  return [
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      description: 'Exciting opportunity for a skilled developer...',
      url: 'https://example.com/job',
      postedDate: new Date().toISOString(),
      salary: '$100,000 - $150,000',
      skills: ['JavaScript', 'React', 'Node.js'],
      matchScore: 85,
      source: 'linkedin',
      commuteTime: 0,
      distance: 0
    }
  ];
}
