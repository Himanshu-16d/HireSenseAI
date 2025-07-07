import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log('Received job search request');
  
  try {
    // Extract search parameters from URL
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || '';
    const location = searchParams.get('location') || '';
    const keywords = searchParams.get('keywords') || '';

    // Use the job-search API for real data
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/job-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        location,
        keywords
      })
    });

    if (!response.ok) {
      throw new Error(`Job search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.jobs) {
      return NextResponse.json({
        jobs: data.jobs,
        total: data.jobs.length,
        page: 1,
        limit: 20,
      });
    } else {
      return NextResponse.json({
        jobs: [],
        total: 0,
        page: 1,
        limit: 20,
      });
    }
  } catch (error) {
    console.error('Error in jobs API:', error);
    return NextResponse.json({
      jobs: [],
      total: 0,
      page: 1,
      limit: 20,
      error: 'Failed to fetch jobs'
    }, { status: 500 });
  }
} 