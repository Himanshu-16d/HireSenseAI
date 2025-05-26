import JobFinder from "@/components/job-finder"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/protected-route"
import JobSearchVisualizations from "@/components/JobSearchVisualizations"

export default function JobFinderPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-5xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">AI Job Finder</CardTitle>
            <CardDescription>Find jobs that match your skills and experience using AI</CardDescription>
          </CardHeader>
          <CardContent>
            <JobFinder />
          </CardContent>
        </Card>
        
        {/* Add the job search visualizations */}
        <JobSearchVisualizations />
      </main>
    </ProtectedRoute>
  )
}
