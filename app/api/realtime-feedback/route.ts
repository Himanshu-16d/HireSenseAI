import { NextResponse } from "next/server";
import { getRealtimeFeedback } from "@/actions/realtime-feedback";

export async function POST(request: Request) {
  try {
    const { resumeData, jobDescription } = await request.json();
    const result = await getRealtimeFeedback(resumeData, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get real-time feedback" }, { status: 500 });
  }
} 