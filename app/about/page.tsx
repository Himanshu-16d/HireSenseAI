import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, Code, Target, Brain, Search } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
          About HireSense AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A next-generation AI-powered recruitment platform built to transform how job seekers and employers connect.
        </p>
      </section>

      {/* Who We Are Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              In a job market flooded with resumes and listings, we bring clarity, precision, and speed using cutting-edge artificial intelligence and real-time data insights.
              Whether you're a fresh graduate unsure of where your resume stands or an experienced professional exploring new roles, 
              HireSense AI helps you make smarter career moves — faster and with greater confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-card rounded-lg">
            <div className="mb-2">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Resume Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Powered by DeepSeek-R1-Distill-LLaMA-8B model for deep resume analysis, evaluating skills, role alignment, and providing actionable feedback.
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg">
            <div className="mb-2">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Job Search</h3>
            <p className="text-sm text-muted-foreground">
              Integration with Adzuna for real-time job listings, matching recommendations, and location-based filtering.
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg">
            <div className="mb-2">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Matching Engine</h3>
            <p className="text-sm text-muted-foreground">
              Advanced semantic analysis for better candidate-job alignment, going beyond simple keyword matching.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">The Technology Behind It</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" /> Tech Stack
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Frontend: React + TypeScript + Tailwind CSS</li>
                <li>• Backend: Python & Node.js for modular and fast APIs</li>
                <li>• AI/NLP: DeepSeek-R1-Distill-LLaMA-8B</li>
                <li>• Data Source: Adzuna API for job listings</li>
                <li>• Deployment: Scalable infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Meet The Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TeamMember 
            name="Himanshu Dubey"
            role="Backend & AI Integration"
          />
          <TeamMember 
            name="Smrati Vishnoi"
            role="Frontend Development & UX"
          />
          <TeamMember 
            name="Rishika Chakradhar"
            role="Research & Resume Engine"
          />
          <TeamMember 
            name="Shikha Patle"
            role="Job Search & API Integration"
          />
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Vision for the Future</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We envision a world where resumes don't define people — capabilities do. 
            Our long-term goal is to make hiring more intelligent, inclusive, and personalized.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/resume-builder">
              <Button size="lg">Build Your Resume</Button>
            </Link>
            <Link href="/job-finder">
              <Button variant="outline" size="lg">Find Jobs</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function TeamMember({ name, role }: { name: string; role: string }) {
  return (    <div className="p-6 bg-card rounded-xl text-center">
      <div className="mb-4">
        <Users className="h-12 w-12 text-primary mx-auto" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  )
}
