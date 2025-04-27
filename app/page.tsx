import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Briefcase, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background px-4">
      <section className="w-full max-w-3xl bg-card rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-6 mt-8 mb-8">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-lg">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            AI-Powered
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-poppins bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
            Welcome to HireSense AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Your all-in-one platform for smart resume building and job searching powered by AI. Create, optimize, and find your dream job with intelligent tools.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center mt-4">
          <Link href="/resume-builder" className="w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Build Your Resume
            </Button>
          </Link>
          <Link href="/job-finder" className="w-full md:w-auto">
            <Button size="lg" variant="outline" className="w-full md:w-auto flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Find Jobs
            </Button>
          </Link>
        </div>
      </section>
      <section className="w-full max-w-3xl grid md:grid-cols-2 gap-8 mt-4">
        <div className="bg-muted rounded-xl p-6 shadow flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Resume Builder
          </h2>
          <ul className="list-disc list-inside text-muted-foreground text-base pl-2">
            <li>AI-powered content enhancement</li>
            <li>Real-time resume scoring</li>
            <li>Tailored to specific job descriptions</li>
          </ul>
        </div>
        <div className="bg-muted rounded-xl p-6 shadow flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" /> Job Finder
          </h2>
          <ul className="list-disc list-inside text-muted-foreground text-base pl-2">
            <li>AI-powered job matching</li>
            <li>Skills gap analysis</li>
            <li>LinkedIn integration</li>
          </ul>
        </div>
      </section>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} HireSenseAI. All rights reserved.
      </footer>
    </main>
  )
}
