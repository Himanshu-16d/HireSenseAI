import { NextResponse } from "next/server";
import { testNVIDIAConnection, getAIClient } from "@/lib/ai-client";

export async function GET() {
  try {
    const result = await testNVIDIAConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "NVIDIA DeepSeek AI is working!",
        response: result.response,
        model: "deepseek-ai/deepseek-r1-distill-llama-8b"
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: "Failed to connect to NVIDIA DeepSeek AI"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("NVIDIA DeepSeek test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to connect to NVIDIA DeepSeek AI"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { prompt, temperature = 0.6, maxTokens = 4096 } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: "Prompt is required"
      }, { status: 400 });
    }

    const client = getAIClient();
    
    const messages = [
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    const response = await client.callAPI(messages, {
      temperature,
      maxTokens
    });
    
    return NextResponse.json({
      success: true,
      response: response.choices[0]?.message?.content,
      model: "deepseek-ai/deepseek-r1-distill-llama-8b"
    });
  } catch (error) {
    console.error("NVIDIA DeepSeek API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}