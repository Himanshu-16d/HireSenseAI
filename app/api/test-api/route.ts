import { NextResponse } from "next/server";
import { callNvidiaAPI } from "@/lib/nvidia-client";
import { MODELS } from "@/lib/nvidia-client";

export async function GET() {
  try {
    // Get environment information
    const config = {
      apiUrl: process.env.NVIDIA_API_URL,
      hasApiKey: !!process.env.NVIDIA_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    };

    // Test API connection
    const testMessage = {
      role: "user",
      content: "Test connection to NVIDIA API."
    };

    try {
      const response = await callNvidiaAPI([testMessage], MODELS.JOB_MATCHING);
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
