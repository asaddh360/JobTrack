"use client"; // Required for using hooks like useRouter and useToast

import { JobPostingForm } from '@/components/admin/JobPostingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addJob } from '@/lib/mock-data';
import type { Job } from '@/types';
import { useRouter } from 'next/navigation'; // Corrected import

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleFormSubmit = async (jobData: Job) => {
    try {
      const newJob = await addJob(jobData); // Assuming addJob takes the full job object sans ID and returns it with an ID.
      toast({
        title: "Job Posted!",
        description: `The job "${newJob.title}" has been successfully posted.`,
      });
      router.push('/admin/jobs');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem posting the job. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to post job:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Job Posting</CardTitle>
          <CardDescription>Fill in the details below to post a new job.</CardDescription>
        </CardHeader>
        <CardContent>
          <JobPostingForm onSubmitSuccess={handleFormSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
