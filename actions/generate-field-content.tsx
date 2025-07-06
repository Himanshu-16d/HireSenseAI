"use server";
import { callGroqAPI, cleanResponseText } from "@/lib/ai-client";
import { ALL_TECHNOLOGIES } from "@/lib/technologies";

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
    prompt = `Given this project, return ONLY a comma-separated list of the most relevant technologies used (3-8 max) from this list:\n${ALL_TECHNOLOGIES.join(", ")}\n\nProject:\n${JSON.stringify(project)}\n\nReturn ONLY the comma-separated list, no other text.`;
  } else if (field === "achievements") {
    prompt = `Given this work experience, return ONLY a concise, comma-separated list of a maximum of 3 key achievements or impact statements. Do NOT include any explanation, introduction, or extra text. No markdown, no bullet points, no sentences, just the list. Example: Increased sales by 20%, Led a team of 5, ...\n${JSON.stringify(experience)}\n`;
  }
  const response = await callGroqAPI([
    { role: "system", content: "You are an expert resume writer and career coach. Always respond directly with the content requested without any prefixes, quotes, or explanations." },
    { role: "user", content: prompt }
  ], "llama3-70b-8192");
  
  // Clean the response text
  const rawContent = response.choices[0]?.message?.content?.trim() || "";
  return cleanResponseText(rawContent);
}