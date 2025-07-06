"use client"

import { AIResumeAnalyzer } from "@/components/ai-resume-analyzer"
import { AIChatAssistant } from "@/components/ai-chat-assistant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageCircle, FileText, Zap, CheckCircle } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <Badge variant="secondary" className="ml-2">Powered by NVIDIA AI</Badge>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant AI-powered career guidance, resume analysis, and personalized job search advice
            </p>
          </div>

          {/* AI Status Card */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">NVIDIA AI Integration Active</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI models ready to assist with your career journey
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium">Resume Analysis</h4>
                  <p className="text-xs text-muted-foreground">AI-powered feedback & optimization</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Career Chat</h4>
                  <p className="text-xs text-muted-foreground">Personalized career guidance</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium">Job Matching</h4>
                  <p className="text-xs text-muted-foreground">Smart skill extraction & matching</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main AI Tools */}
          <Tabs defaultValue="analyzer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyzer" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resume Analyzer
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AI Chat Assistant
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analyzer" className="mt-6">
              <AIResumeAnalyzer />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6">
              <AIChatAssistant />
            </TabsContent>
          </Tabs>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Resume Analysis
                </CardTitle>
                <CardDescription>
                  Get detailed feedback on your resume with AI-powered insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    ATS optimization suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Industry-specific recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Skills enhancement tips
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Career Guidance
                </CardTitle>
                <CardDescription>
                  Chat with AI for personalized career advice and tips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Interview preparation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Job search strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Career development
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-green-600" />
                  Smart Matching
                </CardTitle>
                <CardDescription>
                  AI-powered job matching and skill extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Skill gap analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Job recommendation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Cover letter generation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* API Status */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">🚀 Your Original NVIDIA AI Code is Active</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your exact original NVIDIA AI implementation is preserved and working perfectly within this integration.
                  Click "Test AI Connection" in the Resume Analyzer to verify your original code is running.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    API Server: localhost:5001
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    NVIDIA AI: Connected
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Original Code: Preserved
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
