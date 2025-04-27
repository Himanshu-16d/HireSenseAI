import ResumeBuilder from "@/components/resume-builder"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/protected-route"

export default function ResumeBuilderPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 px-4">
        <div className="space-y-6">
          <Card className="max-w-5xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Smart Resume Builder</CardTitle>
              <CardDescription>Powered by Groq AI to create professional resumes with real-time feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeBuilder />
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
