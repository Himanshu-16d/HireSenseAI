import { NextResponse } from "next/server";
import { getRealtimeFeedback } from "@/actions/realtime-feedback";
import { validateApiConfig } from "@/middleware/api-validation";

export async function POST(request: Request) {
  // Validate API configuration
  const validationError = await validateApiConfig();
  if (validationError) return validationError;try {
    const { resumeData, jobDescription } = await request.json();
    const result = await getRealtimeFeedback(resumeData, jobDescription);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Real-time feedback error:", error);

    // Handle specific API errors
    if (error.status === 404) {
      return NextResponse.json(
        { error: "AI API endpoint not found. Please check API configuration." },
        { status: 404 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid AI API key. Please check your credentials." },
        { status: 401 }
      );
    }

    // Handle other errors
    const statusCode = error.status || 500;
    const errorMessage = error.message || "Failed to get real-time feedback";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.details || undefined
      },
      { status: statusCode }
    );
  }
} 