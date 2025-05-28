"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TemplateScanner } from "@/components/template-scanner"
import { useToast } from "@/hooks/use-toast"
import type { ResumeData } from "@/types/resume"

// Sample resume data for testing
const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    summary: "Experienced software engineer with expertise in full-stack development"
  },
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "New York, NY",
      startDate: "2020-01",
      endDate: "Present",
      description: "Led development of cloud-native applications",
      achievements: [
        "Increased system performance by 40%",
        "Implemented CI/CD pipeline"
      ]
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      location: "New York, NY",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.8"
    }
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "AWS",
    "Docker"
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a scalable e-commerce platform using React and Node.js",
      technologies: ["React", "Node.js", "MongoDB"],
      url: "https://github.com/johndoe/ecommerce"
    }
  ]
};

export default function TestTemplateScannerPage() {
  const [enhancedResume, setEnhancedResume] = useState<ResumeData | null>(null);
  const { toast } = useToast();

  const handleEnhancedData = (data: ResumeData) => {
    setEnhancedResume(data);
    toast({
      title: "Resume Enhanced",
      description: "Successfully enhanced resume with selected template",
    });
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Template Scanner Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Scanner Component */}
          <TemplateScanner
            resumeData={sampleResumeData}
            onEnhancedData={handleEnhancedData}
          />

          {/* Display Enhanced Resume */}
          {enhancedResume && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Enhanced Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
                  {JSON.stringify(enhancedResume, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
