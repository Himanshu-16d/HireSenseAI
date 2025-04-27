import { JobDescriptionGenerator } from "@/components/job-description-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/protected-route"

export default function JobDescriptionPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-5xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">AI Job Description Generator</CardTitle>
            <CardDescription>Create professional job descriptions powered by Groq AI</CardDescription>
          </CardHeader>
          <CardContent>
            <JobDescriptionGenerator />
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  )
} 