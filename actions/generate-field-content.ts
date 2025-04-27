"use server";
import { callGroqAPI, MODELS } from "@/lib/groq-client";

export async function generateFieldContent({
  field,
  resumeData,
  jobTarget,
  experience,
  project
}: {
  field: "summary" | "jobDescription" | "experience" | "project",
  resumeData?: any,
  jobTarget?: any,
  experience?: any,
  project?: any
}): Promise<string> {
  let prompt = "";
  if (field === "summary") {
    prompt = `Write a professional summary for this resume:\n${JSON.stringify(resumeData)}\n`;
  } else if (field === "jobDescription") {
    prompt = `Write a short, 2-3 sentence job description for this job target:\n${JSON.stringify(jobTarget)}\n`;
  } else if (field === "experience") {
    prompt = `Write a compelling description for this work experience:\n${JSON.stringify(experience)}\n`;
  } else if (field === "project") {
    prompt = `Write a detailed description for this project:\n${JSON.stringify(project)}\n`;
  }
  const response = await callGroqAPI([
    { role: "system", content: "You are an expert resume writer and career coach." },
    { role: "user", content: prompt }
  ], MODELS.RESUME_ANALYSIS);
  return response.choices[0]?.message?.content?.trim() || "";
} 