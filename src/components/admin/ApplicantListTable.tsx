
"use client";

import type { Application, Pipeline, Job } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Bot, Download } from "lucide-react"; // Added Download icon
import Link from "next/link";
import { updateApplicationStage } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface ApplicantListTableProps {
  job: Job;
  applications: Application[];
  pipeline?: Pipeline;
  onStageChange: (applicationId: string, newStage: string) => void;
}

export function ApplicantListTable({ job, applications, pipeline, onStageChange }: ApplicantListTableProps) {
  const { toast } = useToast();

  const handleStageChange = async (applicationId: string, newStage: string) => {
    const updatedApp = await updateApplicationStage(applicationId, newStage);
    if (updatedApp) {
      onStageChange(applicationId, newStage);
      toast({
        title: "Stage Updated",
        description: `${updatedApp.applicantName}'s stage updated to ${newStage}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update stage.",
        variant: "destructive",
      });
    }
  };

  const handleViewResume = (resumeUrl?: string) => {
    if (resumeUrl) {
      // In a real app, this would trigger a download or open the resume.
      // For mock, we'll just alert the filename.
      alert(`Resume file: ${resumeUrl}\n(Actual download/view functionality is not implemented in this mock environment.)`);
    } else {
      alert("No resume file available for this applicant.");
    }
  };
  
  if (applications.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No applicants for this job yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead>Resume</TableHead> {/* Added Resume column */}
          <TableHead>Current Stage</TableHead>
          <TableHead>AI Screen</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{app.applicantName}</TableCell>
            <TableCell>{app.applicantEmail}</TableCell>
            <TableCell>{new Date(app.submissionDate).toLocaleDateString()}</TableCell>
            <TableCell>
              {app.resumeUrl ? (
                <Button variant="outline" size="sm" onClick={() => handleViewResume(app.resumeUrl)}>
                  <Download className="mr-2 h-4 w-4" /> View
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">N/A</span>
              )}
            </TableCell>
            <TableCell>
              {pipeline ? (
                <Select
                  value={app.currentStage}
                  onValueChange={(newStage) => handleStageChange(app.id, newStage)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipeline.stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.name}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="secondary">{app.currentStage}</Badge>
              )}
            </TableCell>
            <TableCell>
              {app.aiScreeningResult ? (
                <Badge variant={app.aiScreeningResult.match ? 'default' : 'destructive'}>
                  {app.aiScreeningResult.match ? 'Match' : 'Mismatch'}
                </Badge>
              ) : (
                 <Badge variant="outline">Pending</Badge>
              )}
            </TableCell>
            <TableCell className="text-right space-x-2">
              {/* <Button variant="outline" size="icon" asChild title="View Applicant Details">
                <Link href={`/admin/applicants/${app.applicantId}?jobId=${job.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button> */}
               <Button variant="outline" size="sm" asChild title="AI Screener for this applicant">
                 <Link href={`/admin/jobs/${job.id}/screen?applicantId=${app.applicantId}`}>
                     <Bot className="h-4 w-4" />
                 </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
