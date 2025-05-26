"use server";
import { callNvidiaAPI } from "@/lib/groq-client";

export async function generateFieldContent({
  field,
  resumeData,
  jobTarget,
  experience,
  project
}: {
  field: "summary" | "jobDescription" | "experience" | "project" | "skills" | "technologies" | "achievements",
  resumeData?: any,
  jobTarget?: any,
  experience?: any,
  project?: any
}): Promise<string> {
  let prompt = "";
  if (field === "summary") {
    prompt = `Write a professional summary for this resume in 2-3 short lines (max 3 lines):\n${JSON.stringify(resumeData)}\n`;
  } else if (field === "jobDescription") {
    prompt = `Write a short, 2-3 line job description for this job target (max 3 lines):\n${JSON.stringify(jobTarget)}\n`;
  } else if (field === "experience") {
    prompt = `Write a compelling, concise description for this work experience in 2-3 lines (max 3 lines):\n${JSON.stringify(experience)}\n`;
  } else if (field === "project") {
    prompt = `Write a detailed but concise description for this project in 2-3 lines (max 3 lines):\n${JSON.stringify(project)}\n`;
  } else if (field === "skills") {
    prompt = `Given this resume, return ONLY a comma-separated list of the most relevant professional skills (5-10 max). Do NOT include any explanation, introduction, or extra text. No markdown, no bullet points, no sentences, just the list. Example: Skill1, Skill2, Skill3, ...\n${JSON.stringify(resumeData)}\n`;
  } else if (field === "technologies") {
    prompt = `Given this project, return ONLY a comma-separated list of the most relevant technologies used (3-8 max). Do NOT include any explanation, introduction, or extra text. No markdown, no bullet points, no sentences, just the list. Example: Tech1, Tech2, Tech3, ...\n${JSON.stringify(project)}\n`;
  } else if (field === "achievements") {
    prompt = `Given this work experience, return ONLY a concise, comma-separated list of a maximum of 3 key achievements or impact statements. Do NOT include any explanation, introduction, or extra text. No markdown, no bullet points, no sentences, just the list. Example: Increased sales by 20%, Led a team of 5, ...\n${JSON.stringify(experience)}\n`;
  }
  const response = await callNvidiaAPI([
    { role: "system", content: "You are an expert resume writer and career coach." },
    { role: "user", content: prompt }
  ], "deepseek-ai/deepseek-r1");
  return response.choices[0]?.message?.content?.trim() || "";
} 