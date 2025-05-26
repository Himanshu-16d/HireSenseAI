'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import JobSearchVisualizations from "@/components/JobSearchVisualizations"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Globe, Briefcase, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface JobMarketInsights {
  trendingIndustries: { name: string; growth: number }[];
  topLocations: { name: string; jobs: number }[];
  remoteWork: { field: string; percentage: number }[];
}

export default function JobInsightsPage() {
  const [insights, setInsights] = useState<JobMarketInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobMarketInsights() {
      try {
        setLoading(true);
        const response = await fetch('/api/job-market-insights');
        
        if (!response.ok) {
          throw new Error('Failed to fetch job market insights');
        }
        
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching job market insights:', err);
        setError('Failed to load job market insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchJobMarketInsights();
  }, []);

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <Link href="/job-finder">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Job Finder
          </Button>
        </Link>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Job Market Insights</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore interactive visualizations of global job opportunities and in-demand skills
          </p>
        </div>
        
        {/* Main visualizations */}
        <JobSearchVisualizations />
        
        {/* Additional insights */}
        {loading ? (
          <div className="flex justify-center items-center my-16 py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <span className="ml-3 text-lg">Loading real-time job market data...</span>
          </div>
        ) : error ? (
          <div className="text-center my-16 py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Trending Industries</CardTitle>
                </div>
                <CardDescription>Industries with highest growth rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights?.trendingIndustries.map((industry, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{industry.name}</span>
                      <span className="text-green-500">+{industry.growth}%</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Top Locations</CardTitle>
                </div>
                <CardDescription>Cities with most job opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights?.topLocations.map((location, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{location.name}</span>
                      <span>{location.jobs.toLocaleString()} jobs</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Remote Work</CardTitle>
                </div>
                <CardDescription>Remote job availability by field</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights?.remoteWork.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{item.field}</span>
                      <span>{item.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Data refreshed every 6 hours. Powered by Adzuna API and AI analysis.</p>
        </div>
      </div>
    </main>
  );
} 