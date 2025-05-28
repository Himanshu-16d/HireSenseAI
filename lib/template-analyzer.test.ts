import { describe, it, expect, vi } from 'vitest';
import { analyzeTemplate, enhanceResumeWithTemplate } from './template-analyzer';
import { callNvidiaAPI } from './nvidia-client';

// Mock the NVIDIA API client
vi.mock('./nvidia-client', () => ({
  callNvidiaAPI: vi.fn()
}));

describe('Template Analyzer', () => {
  // Sample resume data for testing
  const mockResumeData = {
    personalInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      location: "New York, NY"
    },
    summary: "Experienced software engineer with 5+ years of experience",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "New York, NY",
        startDate: "2020-01",
        endDate: "Present",
        description: "Led development of cloud-native applications"
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of Technology",
        location: "Boston, MA",
        graduationYear: "2019"
      }
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js"]
  };
  const mockTemplateAnalysis = {
    structure: {
      sections: ["header", "summary", "experience", "education", "skills"],
      layout: "single-column",
      styling: "modern-minimal"
    },
    recommendations: [
      "Use bullet points for experience descriptions",
      "Add measurable achievements",
      "Highlight technical skills separately"
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should analyze template structure correctly', async () => {
    // Mock the NVIDIA API response for template analysis
    (callNvidiaAPI as any).mockResolvedValueOnce(JSON.stringify(mockTemplateAnalysis));

    const analysis = await analyzeTemplate("template1");
    
    expect(analysis).toEqual(mockTemplateAnalysis);
    expect(analysis.structure).toHaveProperty('sections');
    expect(analysis.structure).toHaveProperty('layout');
    expect(analysis.recommendations).toBeInstanceOf(Array);
    expect(callNvidiaAPI).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        role: 'system',
        content: expect.stringContaining('expert resume designer')
      }),
      expect.objectContaining({
        role: 'user',
        content: expect.stringContaining('template1')
      })
    ]));
  });

  it('should enhance resume based on template', async () => {
    // Mock template analysis
    const mockTemplateAnalysis = {
      structure: {
        sections: ['header', 'experience', 'skills'],
        layout: 'single-column',
        styling: 'professional'
      },
      recommendations: ['Highlight key achievements']
    };

    // Mock enhanced resume
    const mockEnhancedResume = {
      ...sampleResumeData,
      experience: [{
        ...sampleResumeData.experience[0],
        achievements: ['Improved system performance']
      }]
    };

    (callNvidiaAPI as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockEnhancedResume));

    const result = await enhanceResumeWithTemplate(
      sampleResumeData,
      'template1',
      mockTemplateAnalysis
    );

    expect(result).toEqual(mockEnhancedResume);
    expect(callNvidiaAPI).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        role: 'system'
      }),
      expect.objectContaining({
        role: 'user',
        content: expect.stringContaining('template1')
      })
    ]));
  });

  it('should handle API errors gracefully', async () => {
    (callNvidiaAPI as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    await expect(analyzeTemplate('template1')).rejects.toThrow('Failed to analyze template');
  });
});
