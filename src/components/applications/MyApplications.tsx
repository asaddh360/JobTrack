"use client";

import { useState, useEffect } from 'react';
import type { Application, Job, Pipeline } from '@/types';
import { getApplicationsForUser, getJobById, getPipelineById } from '@/lib/mock-data'; // Assuming a function to get user applications
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Hourglass, ListChecks, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const getStageIcon = (stageName: string) => {
  const lowerStage = stageName.toLowerCase();
  if (lowerStage.includes('received') || lowerStage.includes('submitted')) return <Send className="h-4 w-4 text-blue-500" />;
  if (lowerStage.includes('screening') || lowerStage.includes('review')) return <ListChecks className="h-4 w-4 text-purple-500" />;
  if (lowerStage.includes('interview')) return <Hourglass className="h-4 w-4 text-yellow-500" />;
  if (lowerStage.includes('offer') || lowerStage.includes('hired')) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (lowerStage.includes('reject')) return <AlertCircle className="h-4 w-4 text-red-500" />;
  return <ListChecks className="h-4 w-4 text-gray-500" />;
}

export function MyApplications() {
  const [applications, setApplications] = useState<Array<Application & { job?: Job, pipeline?: Pipeline }>>([]);
  const [loading, setLoading] = useState(true);
  // Simulate a logged-in user. In a real app, this would come from auth.
  const currentUserEmail = 'alice@example.com'; // Example, or 'bob@example.com'

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      const userApplications = await getApplicationsForUser(currentUserEmail);
      const enrichedApplications = await Promise.all(
        userApplications.map(async (app) => {
          const job = await getJobById(app.jobId);
          const pipeline = job ? await getPipelineById(job.pipelineId) : undefined;
          return { ...app, job, pipeline };
        })
      );
      setApplications(enrichedApplications);
      setLoading(false);
    }
    fetchApplications();
  }, [currentUserEmail]);

  const calculateProgress = (currentStage: string, pipeline?: Pipeline): number => {
    if (!pipeline) return 0;
    const stageIndex = pipeline.stages.findIndex(s => s.name === currentStage);
    if (stageIndex === -1) return 0;
    // Consider 'Rejected' as an end stage, but not necessarily 100% progress towards hiring.
    if (currentStage.toLowerCase().includes('hired')) return 100;
    if (currentStage.toLowerCase().includes('rejected')) return 100; // Or a different visual representation
    
    const nonNegativeStages = pipeline.stages.filter(s => !s.name.toLowerCase().includes('rejected'));
    const currentNonNegativeStageIndex = nonNegativeStages.findIndex(s => s.name === currentStage);

    if (currentNonNegativeStageIndex === -1) return (stageIndex + 1) / pipeline.stages.length * 100; // fallback if stage not in nonNegativeStages but exists

    return ((currentNonNegativeStageIndex + 1) / nonNegativeStages.length) * 100;
  };


  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Applications</h1>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-8 w-full" />
              <div className="mt-4 flex space-x-2">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-primary">My Applications</h1>
      {applications.length === 0 ? (
        <Card className="text-center p-8">
          <CardTitle>No Applications Found</CardTitle>
          <CardDescription className="mt-2">You haven't applied for any jobs yet.</CardDescription>
          <Button asChild className="mt-4">
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map(app => (
            <Card key={app.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-primary hover:underline">
                      <Link href={`/jobs/${app.jobId}`}>{app.job?.title || 'Job Title Not Found'}</Link>
                    </CardTitle>
                    <CardDescription>Applied on: {new Date(app.submissionDate).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant={app.currentStage.toLowerCase().includes('reject') ? 'destructive' : app.currentStage.toLowerCase().includes('hired') ? 'default' : 'secondary'} className="capitalize">
                    {app.currentStage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round(calculateProgress(app.currentStage, app.pipeline))}%</span>
                  </div>
                  <Progress value={calculateProgress(app.currentStage, app.pipeline)} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">Current Stage: <strong>{app.currentStage}</strong></p>
                <h4 className="font-medium text-sm mb-1 mt-3">Status History:</h4>
                <ul className="space-y-1 text-xs">
                  {app.statusHistory.slice().reverse().map((historyItem, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      {getStageIcon(historyItem.stage)}
                      <span className="ml-2">{historyItem.stage} - {new Date(historyItem.date).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
                {app.aiScreeningResult && (
                    <div className="mt-3 p-3 bg-secondary/50 rounded-md">
                        <h5 className="text-xs font-semibold text-secondary-foreground">AI Screening Note:</h5>
                        <p className={`text-xs ${app.aiScreeningResult.match ? 'text-green-600' : 'text-red-600'}`}>
                            {app.aiScreeningResult.match ? 'Potential Match: ' : 'Potential Mismatch: '}
                            {app.aiScreeningResult.reason}
                        </p>
                    </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
