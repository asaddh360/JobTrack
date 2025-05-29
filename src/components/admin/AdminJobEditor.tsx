"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Job, Application, Pipeline } from '@/types';
import { getApplicationsForJob, getPipelineById, updateJob } from '@/lib/mock-data';
import { JobPostingForm } from './JobPostingForm';
import { ApplicantListTable } from './ApplicantListTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
// Removed Bot icon import as AI screener is removed

interface AdminJobEditorProps {
  job: Job;
}

export function AdminJobEditor({ job: initialJob }: AdminJobEditorProps) {
  const [job, setJob] = useState<Job>(initialJob);
  const [applications, setApplications] = useState<Application[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchJobData = useCallback(async () => {
    setLoading(true);
    const apps = await getApplicationsForJob(job.id);
    setApplications(apps);
    if (job.pipelineId) {
      const ppl = await getPipelineById(job.pipelineId);
      setPipeline(ppl);
    }
    setLoading(false);
  }, [job.id, job.pipelineId]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);
  
  useEffect(() => { 
    setJob(initialJob);
  }, [initialJob]);


  const handleJobUpdate = async (updatedJobData: Job) => {
    try {
      const savedJob = await updateJob({ ...job, ...updatedJobData }); 
      if (savedJob) {
        setJob(savedJob); 
        toast({
          title: "Job Updated!",
          description: `The job "${savedJob.title}" has been successfully updated.`,
        });
        if (savedJob.pipelineId !== pipeline?.id) {
            const newPipeline = await getPipelineById(savedJob.pipelineId);
            setPipeline(newPipeline);
        }
      } else {
        throw new Error("Failed to save job.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating the job. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update job:", error);
    }
  };

  const handleApplicantStageChange = (applicationId: string, newStage: string) => {
    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === applicationId ? { ...app, currentStage: newStage, statusHistory: [...app.statusHistory, {stage: newStage, date: new Date().toISOString()}] } : app
      )
    );
    // Also update the source of truth (mock data)
    const appToUpdate = applications.find(app => app.id === applicationId);
    if (appToUpdate) {
        // In a real app, this would be an API call
        console.log(`Updating stage for ${appToUpdate.applicantName} to ${newStage} in mock data`);
    }
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="applicants" id="applicants">
            Applicants ({loading ? <Skeleton className="h-4 w-4 inline-block ml-1" /> : applications.length})
          </TabsTrigger>
        </TabsList>
        {/* AI Screener Button Removed */}
      </div>

      <TabsContent value="details">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Job: {job.title}</CardTitle>
            <CardDescription>Modify the details for this job posting.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobPostingForm initialData={job} onSubmitSuccess={handleJobUpdate} isEditing />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="applicants">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Applicants for: {job.title}</CardTitle>
            <CardDescription>Manage applicants and their progress through the hiring pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border-b">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <ApplicantListTable job={job} applications={applications} pipeline={pipeline} onStageChange={handleApplicantStageChange} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
