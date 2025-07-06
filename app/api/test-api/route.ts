import { NextResponse } from "next/server";
import { callGroqAPI } from "@/lib/ai-client";
import { MODELS } from "@/lib/ai-client";

export async function GET() {
  try {
    // Get environment information
    const config = {
      apiUrl: "NVIDIA DeepSeek AI Endpoints",
      hasApiKey: !!process.env.NVIDIA_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    };

    // Test API connection
    const testMessage = {
      role: "user" as const,
      content: "Test connection to NVIDIA DeepSeek AI API."
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
