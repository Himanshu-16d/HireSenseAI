import { NextResponse } from "next/server";
import { analyzeTemplate, enhanceResumeWithTemplate } from "@/lib/template-analyzer";
import type { ResumeData } from "@/types/resume";

export async function POST(request: Request) {
  try {
    const { templateId, resumeData } = await request.json();

    // Step 1: Analyze the selected template
    const templateAnalysis = await analyzeTemplate(templateId);

    // Step 2: Enhance the resume based on template analysis
    const enhancedResume = await enhanceResumeWithTemplate(
      resumeData,
      templateId,
      templateAnalysis
    );    // Validate the enhanced resume data
    if (!enhancedResume.personalInfo || !enhancedResume.experience || !enhancedResume.education) {
      throw new Error("Invalid resume data structure");
    }

    return NextResponse.json(enhancedResume);
  } catch (error) {
    console.error("Error enhancing resume:", error);
    return NextResponse.json(
      { error: "Failed to enhance resume" },
      { status: 500 }
    );
  }
}
