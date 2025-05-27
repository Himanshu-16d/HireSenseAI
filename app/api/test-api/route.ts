import { NextResponse } from "next/server";
import { callGroqAPI } from "@/lib/groq-client";
import { MODELS } from "@/lib/groq-client";

export async function GET() {
  try {
    // Get environment information
    const config = {
      apiUrl: process.env.GROQ_API_URL,
      hasApiKey: !!process.env.GROQ_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    };

    // Test API connection
    const testMessage = {
      role: "user",
      content: "Test connection to Groq API."
    };

    try {
      const response = await callGroqAPI([testMessage], MODELS.JOB_MATCHING);
      return NextResponse.json({
        status: "success",
        config,
        apiResponse: response,
      });
    } catch (apiError: any) {
      return NextResponse.json({
        status: "error",
        config,
        error: {
          message: apiError.message,
          status: apiError.status,
          details: apiError.details,
        }
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message
    }, { status: 500 });
  }
}
