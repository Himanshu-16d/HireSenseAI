import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

// Groq API credentials from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL;
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "llama3-70b-8192";

// Adzuna API credentials
const APP_ID = process.env.ADZUNA_APP_ID || '';
const APP_KEY = process.env.ADZUNA_APP_KEY || '';

// Cache the results for 6 hours to avoid excessive API calls
let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// Define interface for Groq API response
interface GroqApiResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function GET() {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Fetch data from Adzuna API for top categories
    const categoriesResponse = await fetch(
      `https://api.adzuna.com/v1/api/jobs/gb/categories?app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    
    // Fetch top locations data
    const locationsResponse = await fetch(
      `https://api.adzuna.com/v1/api/jobs/gb/top_locations?app_id=${APP_ID}&app_key=${APP_KEY}`
    );

    // Handle API errors
    if (!categoriesResponse.ok || !locationsResponse.ok) {
      throw new Error('Failed to fetch data from Adzuna API');
    }

    const categoriesData = await categoriesResponse.json();
    const locationsData = await locationsResponse.json();

    // Use Groq API to analyze the job market data and generate insights
    const payload = {
      messages: [
        {
          role: "system",
          content: "You are a job market analyst. Analyze the provided job market data and generate insights."
        },
        {
          role: "user",
          content: `Based on this job categories data: ${JSON.stringify(categoriesData)} 
          and locations data: ${JSON.stringify(locationsData)}, 
          generate the following in JSON format:
          1. Top 5 trending industries with growth rates (percentage)
          2. Top 5 locations with job counts
          3. Top 5 fields with remote work availability (percentage)
          Make the data realistic but optimized for display. Format as:
          {
            "trendingIndustries": [{"name": "Industry Name", "growth": growth_rate_as_number}],
            "topLocations": [{"name": "Location Name", "jobs": job_count_as_number}],
            "remoteWork": [{"field": "Field Name", "percentage": percentage_as_number}]
          }`
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    };

    if (!GROQ_API_URL) {
      throw new Error('Groq API URL is not defined');
    }

    const aiResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
      throw new Error(`Groq API call failed: ${aiResponse.status} ${await aiResponse.text()}`);
    }

    // Parse the AI-generated insights
    const aiData = await aiResponse.json() as GroqApiResponse;
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    let parsedInsights;
    
    try {
      // Extract JSON from the AI response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInsights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract JSON from AI response');
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback to default data if parsing fails
      parsedInsights = getDefaultInsights();
    }

    // Cache the results
    cachedData = parsedInsights;
    lastFetchTime = now;

    return NextResponse.json(parsedInsights);
  } catch (error) {
    console.error('Error fetching job market insights:', error);
    
    // Return default data if there's an error
    const defaultInsights = getDefaultInsights();
    return NextResponse.json(defaultInsights);
  }
}

// Fallback data if API calls fail
function getDefaultInsights() {
  return {
    trendingIndustries: [
      { name: "Artificial Intelligence", growth: 35 },
      { name: "Healthcare Tech", growth: 28 },
      { name: "Renewable Energy", growth: 24 },
      { name: "Cybersecurity", growth: 22 },
      { name: "Data Science", growth: 20 }
    ],
    topLocations: [
      { name: "San Francisco, USA", jobs: 12450 },
      { name: "London, UK", jobs: 10280 },
      { name: "Singapore", jobs: 8740 },
      { name: "Toronto, Canada", jobs: 7890 },
      { name: "Berlin, Germany", jobs: 7320 }
    ],
    remoteWork: [
      { field: "Software Development", percentage: 78 },
      { field: "Digital Marketing", percentage: 72 },
      { field: "Content Creation", percentage: 68 },
      { field: "UX/UI Design", percentage: 65 },
      { field: "Project Management", percentage: 58 }
    ]
  };
} 