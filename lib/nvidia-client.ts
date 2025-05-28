// ...existing code...

// Helper function to analyze template structure
export async function analyzeTemplate(templateId: string): Promise<any> {
  const messages = [
    {
      role: "system",
      content: "You are an expert resume template analyzer that can understand resume layouts and structures to help match content to specific templates."
    },
    {
      role: "user",
      content: `Analyze resume template ${templateId} and provide a structured analysis of its layout, sections, and formatting style. 
      This will be used to enhance user resumes to match this template's structure.`
    }
  ];

  return callNvidiaAPI(messages);
}

// Helper function to enhance resume content based on template
export async function enhanceResumeContent(
  resumeData: any,
  templateId: string,
  templateAnalysis: any
): Promise<any> {
  const messages = [
    {
      role: "system",
      content: "You are an expert resume writer that enhances resumes to match specific templates while maintaining professional standards and ATS optimization."
    },
    {
      role: "user",
      content: `Enhance this resume content to match template ${templateId}:

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Template Analysis:
${JSON.stringify(templateAnalysis, null, 2)}

Enhance the content by:
1. Maintaining all key information
2. Restructuring to match the template format
3. Improving language and phrasing
4. Optimizing for ATS compatibility
5. Highlighting key achievements and skills
6. Ensuring proper section organization`
    }
  ];

  return callNvidiaAPI(messages);
}

// Function to validate enhanced resume data
export function validateEnhancedResume(data: any): boolean {
  try {
    // Basic structure validation
    if (!data || typeof data !== 'object') return false;
    
    // Required sections
    const requiredSections = [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills'
    ];
    
    return requiredSections.every(section => 
      data[section] && 
      (Array.isArray(data[section]) || typeof data[section] === 'object')
    );
  } catch (error) {
    console.error('Resume validation error:', error);
    return false;
  }
}