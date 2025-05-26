"use server";
import { analyzeResumeRealtime } from "@/lib/nvidia-client";

export async function getRealtimeFeedback(resumeData: any, jobDescription?: string) {
  return await analyzeResumeRealtime(resumeData, jobDescription);
} 