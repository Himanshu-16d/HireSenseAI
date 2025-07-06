"use server";
import { analyzeResumeRealtime } from "@/lib/ai-client";

export async function getRealtimeFeedback(resumeData: any, jobDescription?: string) {
  return await analyzeResumeRealtime(resumeData, jobDescription);
} 