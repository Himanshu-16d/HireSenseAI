import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Briefcase, FileText, FileCode, BarChart3, Search, LayoutDashboard, Clock, CheckCircle, LineChart } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Content starts here */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <section className="w-full max-w-3xl mx-auto bg-card/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-6 mt-8 mb-8">
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-lg">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              AI-Powered
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-poppins bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
              Welcome to HireSense AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Your all-in-one platform for smart resume building and job searching
              powered by AI. Create, optimize, and find your dream job with
              intelligent tools.
            </p>
          </div>          <div className="flex flex-col md:flex-row gap-4 w-full justify-center mt-4">
            <Link href="/resume-builder" className="w-full md:w-auto">
              <Button
                size="lg"
                className="w-full md:w-auto flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                Build Your Resume
              </Button>
            </Link>
            <Link href="/job-finder" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full md:w-auto flex items-center gap-2"
              >
                <Briefcase className="h-5 w-5" />
                Find Jobs
              </Button>
            </Link>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 shadow-md flex flex-col gap-3 h-full min-h-[250px]">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-lg">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              Resume Builder
            </h2>
            <ul className="list-disc list-inside text-muted-foreground text-base pl-2 space-y-2">
              <li>AI-powered content enhancement</li>
              <li>Real-time resume scoring</li>
              <li>Tailored to specific job descriptions</li>
            </ul>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 shadow-md flex flex-col gap-3 h-full min-h-[250px]">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              Job Finder
            </h2>
            <ul className="list-disc list-inside text-muted-foreground text-base pl-2 space-y-2">
              <li>AI-powered job matching</li>
              <li>Skills gap analysis</li>
              <li>LinkedIn integration</li>
            </ul>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="w-full max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">More Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-md h-full min-h-[250px] flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-primary/20 p-4 rounded-lg flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Resume Scoring</h3>
              </div>
              <p className="text-muted-foreground text-base">
                AI analyzes your resume and gives you a detailed score with improvement tips.
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-md h-full min-h-[250px] flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-primary/20 p-4 rounded-lg flex-shrink-0">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Job Search Using Resume</h3>
              </div>
              <p className="text-muted-foreground text-base">
                Instant job matches based on your resume content using real-time data from JSsearch.
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-md h-full min-h-[250px] flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-primary/20 p-4 rounded-lg flex-shrink-0">
                  <LayoutDashboard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Personal Dashboard</h3>
              </div>
              <p className="text-muted-foreground text-base">
                Track your resume score history and view saved or applied jobs in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Why HireSense AI Section */}
        <section className="w-full max-w-4xl mx-auto mt-16 bg-card/80 backdrop-blur-sm p-10 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">Why HireSense AI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/20 p-5 rounded-full mb-5">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Saves Time</h3>
              <p className="text-muted-foreground text-base">No manual job hunting</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/20 p-5 rounded-full mb-5">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Results</h3>
              <p className="text-muted-foreground text-base">Based on your actual resume</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/20 p-5 rounded-full mb-5">
                <LineChart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Actionable Insights</h3>
              <p className="text-muted-foreground text-base">Know what to improve</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="w-full max-w-4xl mx-auto mt-16 bg-card/80 backdrop-blur-sm p-10 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">About HireSense AI</h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto text-base leading-relaxed">
            HireSense AI is a cutting-edge platform designed to revolutionize the job search and resume building process.
            Our AI-powered tools analyze resumes, match candidates with suitable positions, and provide actionable insights
            to improve job application success rates. We're committed to helping job seekers navigate the complex job market
            with intelligent, data-driven solutions.
          </p>
        </section>

        {/* Footer with Links */}
        <footer className="w-full max-w-4xl mx-auto mt-20 border-t border-border/40 pt-8 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} HireSenseAI. All rights reserved.
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Contact
              </Link>
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
