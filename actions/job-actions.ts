"use server"

import type { Job, JobSearchParams, ResumeData } from "@/types/job"
import { headers } from "next/headers"

export async function findJobs(
  searchParams: JobSearchParams & { page?: number; pageSize?: number }, 
  resumeData: ResumeData | null
): Promise<{
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
}> {
  try {
    console.log('Starting job search with params:', searchParams);
    
    // Ensure location defaults to India if not specified but preserve user's location choice
    const finalSearchParams = {
      ...searchParams,
      location: searchParams.location || 'India',
      page: searchParams.page || 1,
      pageSize: searchParams.pageSize || 10,
      enhanced: (searchParams.pageSize || 10) > 10 // Use enhanced search for larger page sizes
    };
    
    console.log('Final search params with India default:', finalSearchParams);
    
    // Get the host from headers with fallback
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3001";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    
    // Construct the base URL
    const baseUrl = `${protocol}://${host}`;
    
    // Choose API endpoint based on page size
    const apiEndpoint = finalSearchParams.enhanced ? '/api/job-search-enhanced' : '/api/job-search';
    const searchUrl = `${baseUrl}${apiEndpoint}`;

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
      return {
        jobs: [],
        pagination: {
          currentPage: finalSearchParams.page,
          pageSize: finalSearchParams.pageSize,
          totalJobs: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          startIndex: 0,
          endIndex: 0
        }
      };
    }

    console.log('Returning jobs with pagination:', data.jobs, data.pagination);
    return {
      jobs: data.jobs,
      pagination: data.pagination
    };
  } catch (error) {
    console.error("Error finding jobs:", error);
    return {
      jobs: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalJobs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
        startIndex: 0,
        endIndex: 0
      }
    };
  }
}


