"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Job } from '@/types';
import { getJobs, getApplicationsForJob } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Users } from 'lucide-react'; // Removed Bot, BarChart icons
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface JobWithApplicantCount extends Job {
  applicantCount: number;
}

export function AdminJobList() {
  const [jobs, setJobs] = useState<JobWithApplicantCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobsData() {
      setLoading(true);
      const fetchedJobs = await getJobs();
      const jobsWithCounts = await Promise.all(
        fetchedJobs.map(async (job) => {
          const applications = await getApplicationsForJob(job.id);
          return { ...job, applicantCount: applications.length };
        })
      );
      setJobs(jobsWithCounts);
      setLoading(false);
    }
    fetchJobsData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2 border-b">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Manage Jobs</CardTitle>
          <CardDescription>View, edit, and create new job postings.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No jobs posted yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map(job => (
                <TableRow key={job.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'Open' ? 'default' : 'destructive'}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Link href={`/admin/jobs/${job.id}#applicants`} className="flex items-center hover:underline text-primary">
                        <Users className="mr-1 h-4 w-4" /> {job.applicantCount}
                     </Link>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild title="Edit Job">
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Edit3 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    {/* AI Screen Button Removed */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
