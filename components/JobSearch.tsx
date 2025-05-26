"use client"

import { useState, useEffect } from 'react'
import { useJobSearch } from '@/hooks/useJobSearch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const JobSearch = () => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    location: '',
    keywords: '',
    remote: false,
    useResume: true,
    locationType: 'any' as const
  })

  const { jobs, loading, error, connected, searchJobs } = useJobSearch()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchJobs(searchParams)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Job Search</CardTitle>
              <CardDescription>Find your next opportunity with real-time job listings</CardDescription>
            </div>
            <Badge variant={connected ? "default" : "destructive"} className="flex items-center gap-2">
              {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Job Title</label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Software Engineer"
                  value={searchParams.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., New York"
                  value={searchParams.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="keywords" className="text-sm font-medium">Keywords</label>
                <Input
                  id="keywords"
                  name="keywords"
                  placeholder="e.g., React, TypeScript"
                  value={searchParams.keywords}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="locationType" className="text-sm font-medium">Location Type</label>
                <select
                  id="locationType"
                  name="locationType"
                  value={searchParams.locationType}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, locationType: e.target.value as any }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="any">Any</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remote"
                name="remote"
                checked={searchParams.remote}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remote" className="text-sm font-medium">Remote Only</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useResume"
                name="useResume"
                checked={searchParams.useResume}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="useResume" className="text-sm font-medium">Use my resume for better matches</label>
            </div>
            <Button type="submit" disabled={loading || !connected} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search Jobs'
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-8 space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-gray-500">{job.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={job.matchScore >= 80 ? "default" : "secondary"}>
                        {job.matchScore}% Match
                      </Badge>
                      <p className="text-gray-500 text-sm mt-1">{job.source}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{job.description}</p>
                  <div className="mt-4">
                    <h4 className="font-medium">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-gray-600">{job.salary}</p>
                    <Button variant="outline" asChild>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Job
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
