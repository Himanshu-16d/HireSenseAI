import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Calendar, ExternalLink, DollarSign, Clock, Briefcase } from "lucide-react"
import type { Job } from "@/types/job"

interface JobListingCardProps {
  job: Job
}

export default function JobListingCard({ job }: JobListingCardProps) {
  if (!job) return null

  // Format the posted date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <CardHeader className="pb-2 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold line-clamp-2">
                {job.title}
              </CardTitle>
            </div>
            <CardDescription className="flex items-center text-base">
              <Building className="h-4 w-4 mr-1.5" />
              {job.company}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2 bg-primary/5">
            {job.source}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center bg-muted/50 px-2 py-1 rounded-md">
            <MapPin className="h-4 w-4 mr-1.5" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center bg-muted/50 px-2 py-1 rounded-md">
              <DollarSign className="h-4 w-4 mr-1.5" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center bg-muted/50 px-2 py-1 rounded-md">
            <Calendar className="h-4 w-4 mr-1.5" />
            {formatDate(job.postedDate)}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          {job.skills?.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs bg-primary/10">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t">
        <Button variant="outline" size="sm" className="flex items-center hover:bg-primary/10">
          <Clock className="h-4 w-4 mr-1.5" />
          Save
        </Button>
        <Button size="sm" asChild className="flex items-center bg-primary hover:bg-primary/90">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            Apply <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
