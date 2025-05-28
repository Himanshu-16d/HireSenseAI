"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ResumeData } from "@/types/resume"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TemplateOption {
  id: string;
  name: string;
  path: string;
}

const TEMPLATES: TemplateOption[] = [
  { id: "template1", name: "Professional Template", path: "/templates/template1.png" },
  { id: "template2", name: "Creative Template", path: "/templates/template2.png" },
  { id: "template3", name: "Modern Template", path: "/templates/template3.png" },
];

interface TemplateScannerProps {
  resumeData?: ResumeData;
  onEnhancedData?: (data: ResumeData) => void;
}

export function TemplateScanner({ resumeData, onEnhancedData }: TemplateScannerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<ResumeData | null>(null);
  const { toast } = useToast();

  const handleTemplateSelect = async (template: TemplateOption) => {
    setSelectedTemplate(template);
    setLoading(true);
    
    try {
      // Get a preview of how the resume would look with this template
      const response = await fetch("/api/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          resumeData
        })
      });

      if (!response.ok) throw new Error("Failed to generate preview");
      
      const { data } = await response.json();
      setPreviewData(data.enhancedResume);
    } catch (error) {
      console.error("Preview generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceResume = async () => {
    if (!selectedTemplate || !resumeData) return;

    setLoading(true);
    try {
      // Here we would call the NVIDIA API to analyze the template and enhance the resume
      const enhancedData = await enhanceResumeWithTemplate(resumeData, selectedTemplate.id);
      onEnhancedData?.(enhancedData);
      
      toast({
        title: "Resume Enhanced",
        description: "Your resume has been enhanced based on the selected template.",
      });
    } catch (error) {
      console.error("Error enhancing resume:", error);
      toast({
        title: "Error",
        description: "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select a Template</CardTitle>
          <CardDescription>
            Choose a template to enhance your resume with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedTemplate?.id === template.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={template.path}
                  alt={template.name}
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2">
                  <p className="text-sm font-medium text-center">{template.name}</p>
                </div>
                {loading && selectedTemplate?.id === template.id && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {previewData && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="border rounded-lg p-4">
                <ResumePreview data={previewData} />
              </div>
            </div>
          )}          <div className="mt-6 flex gap-4">
            <Button
              className="flex-1"
              onClick={handleEnhanceResume}
              disabled={!selectedTemplate || loading || !previewData}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying Template...
                </>
              ) : (
                "Apply Template Changes"
              )}
            </Button>
            {previewData && (
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewData(null);
                  setSelectedTemplate(null);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function enhanceResumeWithTemplate(resumeData: ResumeData, templateId: string): Promise<ResumeData> {
  // Format the prompt for the AI
  const prompt = `
Analyze this resume content and enhance it to match the style and structure of template ${templateId}:

Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Please enhance this resume by:
1. Maintaining the same core information
2. Restructuring content to match the selected template
3. Improving language and phrasing
4. Optimizing for ATS compatibility
5. Highlighting key achievements and skills

Return the enhanced resume data in the same JSON structure.
`;

  // Call NVIDIA API to enhance the resume
  const response = await fetch("/api/enhance-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      templateId,
      resumeData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to enhance resume");
  }

  return response.json();
}
