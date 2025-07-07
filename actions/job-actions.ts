"use server"

import type { Job, JobSearchParams, ResumeData } from "@/types/job"
import { headers } from "next/headers"

export async function findJobs(searchParams: JobSearchParams, resumeData: ResumeData | null): Promise<Job[]> {
  try {
    console.log('Starting job search with params:', searchParams);
    
    // Ensure location defaults to India if not specified
    const finalSearchParams = {
      ...searchParams,
      location: searchParams.location || 'India'
    };
    
    console.log('Final search params with India default:', finalSearchParams);
    
    // Get the host from headers with fallback
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3001";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    
    // Construct the base URL
    const baseUrl = `${protocol}://${host}`;
    
    // Use the job-search API endpoint for real job data
    const searchUrl = `${baseUrl}/api/job-search`;

    console.log('Fetching jobs from URL:', searchUrl);
    
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalSearchParams),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search jobs: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received job data:', data);
    
    if (!data.success || !data.jobs) {
      console.warn('No jobs found or API error:', data);
      return [];
    }

    console.log('Returning jobs:', data.jobs);
    return data.jobs;
  } catch (error) {
    console.error("Error finding jobs:", error);
    return [];
  }
}


