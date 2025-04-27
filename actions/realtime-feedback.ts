"use server";
import { analyzeResumeRealtime } from "@/lib/groq-client";

export async function getRealtimeFeedback(resumeData: any, jobDescription?: string) {
  return await analyzeResumeRealtime(resumeData, jobDescription);
} 