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
    );

    // Parse and validate the enhanced resume data
    let enhancedData: ResumeData;
    try {
      enhancedData = JSON.parse(completion);
      
      // Basic validation
      if (!enhancedData.personalInfo || !enhancedData.experience || !enhancedData.education) {
        throw new Error("Invalid resume data structure");
      }
    } catch (error) {
      console.error("Error parsing enhanced resume data:", error);
      throw new Error("Failed to process enhanced resume data");
    }

    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error("Error enhancing resume:", error);
    return NextResponse.json(
      { error: "Failed to enhance resume" },
      { status: 500 }
    );
  }
}
