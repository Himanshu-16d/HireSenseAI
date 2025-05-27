import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function validateApiConfig() {
  const requiredEnvVars = {
    NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
    NVIDIA_API_URL: process.env.NVIDIA_API_URL,
  };

  // Check for missing environment variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return NextResponse.json(
      {
        error: 'API configuration error',
        details: `Missing required environment variables: ${missingVars.join(', ')}`,
      },
      { status: 500 }
    );
  }

  return null; // Continue with the request if validation passes
}
