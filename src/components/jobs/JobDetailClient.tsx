"use client";

import { useState } from 'react';
import type { Job } from '@/types';
import { ApplicationForm } from './ApplicationForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, MapPin, Briefcase, ListChecks, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface JobDetailClientProps {
  job: Job;
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setApplicationSubmitted(true);
    setShowApplicationForm(false); // Optionally hide form after submission
  };

  return (
    <div className="container py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-primary mb-2">{job.title}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mb-1 flex items-center">
                <MapPin className="h-5 w-5 mr-2" /> {job.location}
              </CardDescription>
              <CardDescription className="text-sm text-muted-foreground flex items-center">
                <Briefcase className="h-4 w-4 mr-2" /> Posted: {new Date(job.postedDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0 text-right">
               <Badge variant={job.status === 'Open' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                {job.status}
              </Badge>
              <p className="text-sm text-destructive mt-2 flex items-center justify-end">
                <CalendarClock className="h-4 w-4 mr-1" /> Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert mb-6">
            <h3 className="font-semibold text-foreground/80 mb-2 flex items-center"><ListChecks className="h-5 w-5 mr-2 text-primary" />Job Description</h3>
            <p>{job.description}</p>
            <h3 className="font-semibold text-foreground/80 mt-6 mb-2 flex items-center"><ListChecks className="h-5 w-5 mr-2 text-primary" />Requirements</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {applicationSubmitted ? (
        <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg shadow-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-700 mb-2">Application Submitted!</h2>
          <p className="text-green-600 mb-6">Thank you for applying for the {job.title} position. We will review your application and get back to you soon.</p>
          <Button asChild variant="outline">
            <a href="/applications">View My Applications <ExternalLink className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      ) : showApplicationForm ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Apply for {job.title}</h2>
          <ApplicationForm job={job} onApplicationSuccess={handleApplicationSuccess} />
        </div>
      ) : job.status === 'Open' ? (
         <div className="text-center">
            <Button onClick={handleApplyClick} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Apply Now
            </Button>
         </div>
      ) : (
        <div className="text-center p-6 bg-muted rounded-lg">
            <p className="text-lg font-semibold">This position is closed and no longer accepting applications.</p>
        </div>
      )}
    </div>
  );
}
