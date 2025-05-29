
"use client";

import { useState, useEffect } from 'react';
import type { Job } from '@/types';
import { ApplicationForm } from './ApplicationForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, MapPin, Briefcase, ListChecks, CheckCircle, ExternalLink, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

interface JobDetailClientProps {
  job: Job;
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const handleApplyClick = () => {
    if (!currentUser) {
      router.push(`/auth/signin?redirect=/jobs/${job.id}`);
    } else {
      setShowApplicationForm(true);
    }
  };

  const handleApplicationSuccess = () => {
    setApplicationSubmitted(true);
    setShowApplicationForm(false); 
  };
  
  // Effect to automatically show form if redirected back from login with a specific flag or query param
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('apply') === 'true' && currentUser && !applicationSubmitted) {
      setShowApplicationForm(true);
      // Clean up query param
      router.replace(`/jobs/${job.id}`, undefined);
    }
  }, [currentUser, job.id, router, applicationSubmitted]);


  if (authLoading) {
    return (
        <div className="container py-8">
            <Card className="mb-8 shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-1" />
                    <Skeleton className="h-5 w-1/3" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-1/4 mb-2" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-5 w-1/4 mb-2" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
            <div className="text-center">
                <Skeleton className="h-12 w-32 mx-auto" />
            </div>
        </div>
    )
  }

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
            <Link href="/applications">View My Applications <ExternalLink className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      ) : showApplicationForm && currentUser ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Apply for {job.title}</h2>
          <ApplicationForm job={job} applicant={currentUser} onApplicationSuccess={handleApplicationSuccess} />
        </div>
      ) : job.status === 'Open' ? (
         <div className="text-center">
            <Button onClick={handleApplyClick} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {currentUser ? "Apply Now" : <><LogIn className="mr-2 h-4 w-4"/>Sign In to Apply</> }
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
