import { callNvidiaAPI } from './nvidia-client';
import type { ResumeData } from '@/types/resume';

interface TemplateAnalysisResult {
  structure: {
    sections: string[];
    layout: string;
    styling: string;
  };
  recommendations: string[];
}

export async function analyzeTemplate(templateId: string): Promise<TemplateAnalysisResult> {
  const prompt = `Analyze resume template ${templateId} and provide structured information about:
1. The template's section organization
2. Layout characteristics
3. Visual styling elements
4. Professional impact recommendations

Return the analysis as a structured JSON object.`;

  try {
    const response = await callNvidiaAPI([
      {
        role: "system",
        content: "You are an expert resume designer and ATS optimization specialist who analyzes resume templates and provides structured insights."
      },
      {
        role: "user",
        content: prompt
      }
    ]);

    return JSON.parse(response);
  } catch (error) {
    console.error('Template analysis error:', error);
    throw new Error('Failed to analyze template');
  }
}

export async function enhanceResumeWithTemplate(
  resumeData: ResumeData,
  templateId: string,
  templateAnalysis: TemplateAnalysisResult
): Promise<ResumeData> {
  const prompt = `Enhance this resume content to match template ${templateId}'s style and structure:

Template Analysis:
${JSON.stringify(templateAnalysis, null, 2)}

Current Resume:
${JSON.stringify(resumeData, null, 2)}

Instructions:
1. Reorganize sections to match template structure
2. Enhance content formatting and presentation
3. Optimize for ATS compatibility
4. Maintain all original information
5. Improve impact of achievements and skills

Return the enhanced resume as a valid JSON object matching the ResumeData type structure.`;

  try {
    const response = await callNvidiaAPI([
      {
        role: "system",
        content: "You are an expert resume enhancement AI that maintains content accuracy while optimizing presentation and impact."
      },
      {
        role: "user",
        content: prompt
      }
    ]);

    return JSON.parse(response);
  } catch (error) {
    console.error('Resume enhancement error:', error);
    throw new Error('Failed to enhance resume');
  }
}
