export const runtime = 'edge';

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    return NextResponse.json({ message: "Test endpoint working" });
  } catch (error: any) {
    console.error("Error in test-ai route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
} 