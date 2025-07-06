"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, CheckCircle, AlertCircle, Lightbulb } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIAnalysisResult {
  success: boolean
  analysis?: string
  error?: string
}

export function AIResumeAnalyzer() {
  const [resumeContent, setResumeContent] = useState("")
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeResume = async () => {
    if (!resumeContent.trim()) {
      setAnalysis({ success: false, error: "Please enter your resume content" })
      return
    }

    setIsAnalyzing(true)
    setAnalysis(null)

    try {
      const response = await fetch('http://localhost:5001/api/ai/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_content: resumeContent
        })
      })

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error('Resume analysis error:', error)
      setAnalysis({ 
        success: false, 
        error: "Failed to analyze resume. Make sure the AI server is running on localhost:5001" 
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const testAI = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('http://localhost:5001/api/ai/original-example', {
        method: 'POST'
      })
      const result = await response.json()
      setAnalysis({ 
        success: true, 
        analysis: `✅ AI Connection Test Successful!\nYour original NVIDIA AI code returned: "${result.response}"\n\nThe AI server is working perfectly and ready to analyze resumes!` 
      })
    } catch (error) {
      setAnalysis({ 
        success: false, 
        error: "AI server is not running. Please start it with: cd scripts && python api-server.py" 
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatAnalysis = (text: string) => {
    // Split by sections and format
    const sections = text.split('\n\n')
    return sections.map((section, index) => {
      if (section.includes('**') && section.includes('**')) {
        // Bold headers
        return (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-lg mb-2 text-primary">
              {section.replace(/\*\*/g, '')}
            </h4>
          </div>
        )
      } else if (section.includes('*') || section.includes('•')) {
        // Bullet points
        const lines = section.split('\n')
        return (
          <div key={index} className="mb-4">
            {lines.map((line, lineIndex) => (
              <div key={lineIndex} className="flex items-start gap-2 mb-1">
                {line.trim().startsWith('*') || line.trim().startsWith('•') ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{line.replace(/^[*•]\s*/, '')}</span>
                  </>
                ) : (
                  <span className="text-sm ml-6">{line}</span>
                )}
              </div>
            ))}
          </div>
        )
      } else {
        // Regular paragraphs
        return (
          <p key={index} className="mb-4 text-sm leading-relaxed">
            {section}
          </p>
        )
      }
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          AI Resume Analyzer
          <Badge variant="secondary" className="ml-2">Powered by NVIDIA AI</Badge>
        </CardTitle>
        <CardDescription>
          Get instant AI-powered feedback on your resume with detailed analysis and improvement suggestions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Resume Content
          </label>
          <Textarea
            value={resumeContent}
            onChange={(e) => setResumeContent(e.target.value)}
            placeholder="Paste your resume content here or type it directly..."
            rows={12}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={analyzeResume}
            disabled={isAnalyzing || !resumeContent.trim()}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={testAI}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Test AI Connection
          </Button>
        </div>

        {analysis && (
          <Card className={`mt-6 ${analysis.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {analysis.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                {analysis.success ? 'AI Analysis Results' : 'Error'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.success && analysis.analysis ? (
                <div className="prose max-w-none">
                  {formatAnalysis(analysis.analysis)}
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{analysis.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground mt-4 p-4 bg-muted rounded-lg">
          <p className="font-medium mb-2">🚀 AI Features Available:</p>
          <ul className="space-y-1">
            <li>• Real-time resume analysis and feedback</li>
            <li>• ATS optimization suggestions</li>
            <li>• Industry-specific recommendations</li>
            <li>• Skills and experience enhancement tips</li>
            <li>• Professional formatting advice</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
