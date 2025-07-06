import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai-client";
import type { ResumeData } from "@/types/resume";

export async function POST(request: Request) {
  try {
    const { templateId, resumeData } = await request.json();

    // Get AI client for resume enhancement
    const aiClient = getAIClient();
    
    if (!aiClient) {
      throw new Error("AI service not available");
    }

    // Create a prompt for resume enhancement
    const enhancementPrompt = `
Please enhance the following resume data for template "${templateId}":

Resume Data: ${JSON.stringify(resumeData, null, 2)}

Please improve the content while maintaining the original structure. Focus on:
1. Improving language and clarity
2. Adding relevant keywords
3. Enhancing descriptions
4. Maintaining professional tone

Return the enhanced resume in the same JSON structure.
`;

    // Use AI to enhance the resume
    const response = await aiClient.chat({
      messages: [{ role: "user", content: enhancementPrompt }],
      temperature: 0.7,
      maxTokens: 2000
    });

    let enhancedResume;
    try {
      enhancedResume = JSON.parse(response.content);
    } catch (parseError) {
      // If AI response isn't valid JSON, return original with minor enhancements
      enhancedResume = {
        ...resumeData,
        lastModified: new Date().toISOString(),
        enhanced: true
      };
    }    // Validate the enhanced resume data
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
