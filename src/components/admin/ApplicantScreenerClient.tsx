"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Job, Applicant, Application } from '@/types';
import { screenApplicants, ScreenApplicantsInput, ScreenApplicantsOutput } from '@/ai/flows/applicant-screener';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Bot, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getJobById, getApplicationsForJob, getApplicantById, addAiScreeningResult } from '@/lib/mock-data'; // Assuming mock data functions
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

interface ApplicantScreenerClientProps {
  jobId: string;
  initialApplicantId?: string; // Optional: if screening a specific applicant
}

interface ApplicantForScreening extends Applicant {
  applicationId: string;
  selected: boolean;
}

export function ApplicantScreenerClient({ jobId, initialApplicantId }: ApplicantScreenerClientProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<ApplicantForScreening[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [jobSkills, setJobSkills] = useState<string[]>([]);
  
  const [screeningResult, setScreeningResult] = useState<ScreenApplicantsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsDataLoading(true);
      const fetchedJob = await getJobById(jobId);
      if (fetchedJob) {
        setJob(fetchedJob);
        setJobDescription(fetchedJob.description);
        setJobSkills(fetchedJob.requirements);
        
        const jobApplications = await getApplicationsForJob(jobId);
        const fetchedApplicants = await Promise.all(
          jobApplications.map(async (app) => {
            const applicantDetails = await getApplicantById(app.applicantId);
            return applicantDetails ? { 
              ...applicantDetails, 
              applicationId: app.id, 
              selected: initialApplicantId ? app.applicantId === initialApplicantId : !app.aiScreeningResult // Select if initial or not yet screened
            } : null;
          })
        );
        setApplicants(fetchedApplicants.filter(Boolean) as ApplicantForScreening[]);
      }
      setIsDataLoading(false);
    }
    fetchData();
  }, [jobId, initialApplicantId]);

  const handleApplicantSelect = (applicantId: string) => {
    setApplicants(prev => 
      prev.map(app => app.id === applicantId ? { ...app, selected: !app.selected } : app)
    );
  };

  const selectedApplicants = useMemo(() => applicants.filter(app => app.selected), [applicants]);

  const handleScreenApplicants = async () => {
    if (!job || selectedApplicants.length === 0) {
      toast({ title: "Error", description: "Job details or selected applicants missing.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setScreeningResult(null);

    const input: ScreenApplicantsInput = {
      jobPosting: {
        title: job.title,
        description: jobDescription,
        skills: jobSkills,
      },
      applicants: selectedApplicants.map(app => ({
        name: app.name,
        resumeText: app.resumeText || "No resume text provided.", // Ensure resumeText is present
      })),
    };

    try {
      const result = await screenApplicants(input);
      setScreeningResult(result);
      toast({ title: "Screening Complete", description: `${result.assessments.length} applicants screened.` });

      // Save results to mock data
      for (const assessment of result.assessments) {
        const screenedApp = selectedApplicants.find(app => app.name === assessment.name);
        if (screenedApp) {
            await addAiScreeningResult(screenedApp.applicationId, {
                match: assessment.match,
                reason: assessment.reason,
            });
        }
      }

    } catch (error) {
      console.error("Screening error:", error);
      toast({ title: "Screening Failed", description: "An error occurred during AI screening.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading job and applicant data...</p>
      </div>
    );
  }

  if (!job) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>Job not found.</AlertDescription></Alert>;
  }
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center"><Bot className="mr-2 h-6 w-6 text-primary" /> AI Applicant Screener</CardTitle>
          <CardDescription>Screen applicants for the job: <strong>{job.title}</strong>. Review and adjust job details if needed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jobDescription">Job Description (editable for screening query)</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="jobSkills">Required Skills (comma-separated, editable for screening query)</Label>
            <Input
              id="jobSkills"
              value={jobSkills.join(', ')}
              onChange={(e) => setJobSkills(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Select Applicants to Screen</CardTitle>
            <CardDescription>Choose which applicants to include in this screening batch.</CardDescription>
        </CardHeader>
        <CardContent>
            {applicants.length === 0 ? (
                <p className="text-muted-foreground">No applicants found for this job.</p>
            ) : (
            <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-2">
                {applicants.map(app => (
                    <div key={app.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                    <Checkbox
                        id={`applicant-${app.id}`}
                        checked={app.selected}
                        onCheckedChange={() => handleApplicantSelect(app.id)}
                    />
                    <Label htmlFor={`applicant-${app.id}`} className="flex-1 cursor-pointer">
                        {app.name} <span className="text-xs text-muted-foreground">({app.email})</span>
                    </Label>
                    </div>
                ))}
                </div>
            </ScrollArea>
            )}
        </CardContent>
      </Card>

      <Button onClick={handleScreenApplicants} disabled={isLoading || selectedApplicants.length === 0} className="w-full md:w-auto">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
        Screen Selected Applicants ({selectedApplicants.length})
      </Button>

      {screeningResult && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Screening Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {screeningResult.assessments.map((assessment, index) => (
              <Alert key={index} variant={assessment.match ? "default" : "destructive"} className="bg-card">
                {assessment.match ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <AlertTitle className={assessment.match ? "text-green-700" : "text-red-700"}>
                  {assessment.name} - {assessment.match ? "Potential Match" : "Potential Mismatch"}
                </AlertTitle>
                <AlertDescription>{assessment.reason}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
