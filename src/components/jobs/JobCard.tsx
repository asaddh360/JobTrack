import Link from 'next/link';
import type { Job } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, CalendarClock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const postedDate = new Date(job.postedDate).toLocaleDateString();
  const deadlineDate = new Date(job.deadline).toLocaleDateString();

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{job.title}</CardTitle>
        <CardDescription className="flex flex-col space-y-1 pt-1">
          <span className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-muted-foreground" /> Posted: {postedDate}</span>
          <span className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> {job.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{job.description}</p>
        <div className="space-x-2 mb-3">
          {job.requirements.slice(0, 3).map(req => (
            <Badge key={req} variant="secondary">{req}</Badge>
          ))}
          {job.requirements.length > 3 && <Badge variant="secondary">+{job.requirements.length - 3} more</Badge>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-destructive flex items-center">
          <CalendarClock className="h-4 w-4 mr-1" /> Deadline: {deadlineDate}
        </div>
        <Button asChild variant="default" size="sm">
          <Link href={`/jobs/${job.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
