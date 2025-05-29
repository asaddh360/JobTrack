
"use client";

import { useState, useMemo } from "react";
import type { Application, Pipeline, Job } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added for search
import { Download, Search as SearchIcon } from "lucide-react"; 
import { updateApplicationStage } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface ApplicantListTableProps {
  job: Job;
  applications: Application[];
  pipeline?: Pipeline;
  onStageChange: (applicationId: string, newStage: string) => void;
}

const ALL_STAGES_VALUE = "_all_stages_";

export function ApplicantListTable({ job, applications, pipeline, onStageChange }: ApplicantListTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>(ALL_STAGES_VALUE);

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
      alert(`Resume file: ${resumeUrl}\n(Actual download/view functionality is not implemented in this mock environment.)`);
    } else {
      alert("No resume file available for this applicant.");
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = searchTerm === "" ||
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = stageFilter === ALL_STAGES_VALUE || app.currentStage === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  }, [applications, searchTerm, stageFilter]);
  
  if (applications.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No applicants for this job yet.</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 border rounded-md bg-muted/20">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {pipeline && (
          <div className="flex-1 md:max-w-xs">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STAGES_VALUE}>All Stages</SelectItem>
                {pipeline.stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.name}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {filteredApplications.length === 0 && (
         <p className="text-muted-foreground text-center py-4">No applicants match your current filters.</p>
      )}

      {filteredApplications.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Current Stage</TableHead>
              {/* AI Screen Column Removed */}
              {/* Actions column might be removed if no actions left or repurposed */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => {
              const cells = [];
              cells.push(<TableCell key="name" className="font-medium">{app.applicantName}</TableCell>);
              cells.push(<TableCell key="email">{app.applicantEmail}</TableCell>);
              cells.push(<TableCell key="appliedOn">{new Date(app.submissionDate).toLocaleDateString()}</TableCell>);
              cells.push(
                <TableCell key="resume">
                  {app.resumeUrl ? (
                    <Button variant="outline" size="sm" onClick={() => handleViewResume(app.resumeUrl)}>
                      <Download className="mr-2 h-4 w-4" /> View
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              );
              cells.push(
                <TableCell key="stage">
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
              );
              // AI Screen specific cell removed
              // Actions cell removed as individual AI screen link is gone. 
              // It could be added back if other per-applicant actions are needed.
              return (
                <TableRow key={app.id} className="hover:bg-muted/50">
                  {cells}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
